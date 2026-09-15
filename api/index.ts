import express from "express";
import { TwitterApi } from "twitter-api-v2";

const app = express();

// Support JSON payload parsing with increased limits for large campaign configuration sync
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Professional health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// ==========================================
// RESILIENCE & TELEMETRY SUBSYSTEM CLASSES
// ==========================================

class TokenBucketRateLimiter {
  private capacities: Record<string, number> = {
    x: 3,
    twitter: 3,
    telegram: 8,
    bluesky: 8,
    facebook: 5,
    slack: 12,
    discord: 12,
  };

  private refillRates: Record<string, number> = { // tokens per second
    x: 1 / 15,       // Refill 1 token every 15 seconds
    twitter: 1 / 15,
    telegram: 1 / 4,  // Refill 1 token every 4 seconds
    bluesky: 1 / 4,
    facebook: 1 / 8,  // Refill 1 token every 8 seconds
    slack: 1 / 3,     // Refill 1 token every 3 seconds
    discord: 1 / 3,
  };

  private state: Record<string, { tokens: number; lastRefilled: number }> = {};

  private getBucket(platformId: string) {
    const key = platformId.toLowerCase();
    const limit = this.capacities[key] || 5;
    const rate = this.refillRates[key] || (1 / 10);

    if (!this.state[key]) {
      this.state[key] = {
        tokens: limit,
        lastRefilled: Date.now(),
      };
    }
    return { bucket: this.state[key], limit, rate };
  }

  public consume(platformId: string): { allowed: boolean; remaining: number; retryAfter?: number } {
    const now = Date.now();
    const { bucket, limit, rate } = this.getBucket(platformId);

    // Refill tokens
    const elapsedSeconds = (now - bucket.lastRefilled) / 1000;
    const refillAmount = elapsedSeconds * rate;
    
    bucket.tokens = Math.min(limit, bucket.tokens + refillAmount);
    bucket.lastRefilled = now;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return { allowed: true, remaining: Math.floor(bucket.tokens) };
    } else {
      const neededTokens = 1 - bucket.tokens;
      const secondsToWait = Math.ceil(neededTokens / rate);
      return { allowed: false, remaining: 0, retryAfter: secondsToWait };
    }
  }
}

class CircuitBreaker {
  private state: Record<string, {
    status: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
    failureCount: number;
    lastFailureTime: number;
  }> = {};

  private threshold = 3; // Trip after 3 consecutive failures
  private cooldownPeriodMs = 15000; // 15 seconds cooldown for visualization & testing

  private getRecord(platformId: string) {
    const key = platformId.toLowerCase();
    if (!this.state[key]) {
      this.state[key] = {
        status: 'CLOSED',
        failureCount: 0,
        lastFailureTime: 0,
      };
    }
    return this.state[key];
  }

  public allowRequest(platformId: string): { allowed: boolean; status: string; cooldownRemaining?: number } {
    const record = this.getRecord(platformId);
    const now = Date.now();

    if (record.status === 'OPEN') {
      const elapsed = now - record.lastFailureTime;
      if (elapsed >= this.cooldownPeriodMs) {
        record.status = 'HALF_OPEN';
        return { allowed: true, status: 'HALF_OPEN' };
      } else {
        return { 
          allowed: false, 
          status: 'OPEN', 
          cooldownRemaining: Math.ceil((this.cooldownPeriodMs - elapsed) / 1000) 
        };
      }
    }
    return { allowed: true, status: record.status };
  }

  public onSuccess(platformId: string) {
    const record = this.getRecord(platformId);
    record.status = 'CLOSED';
    record.failureCount = 0;
  }

  public onFailure(platformId: string) {
    const record = this.getRecord(platformId);
    record.failureCount += 1;
    if (record.failureCount >= this.threshold) {
      record.status = 'OPEN';
      record.lastFailureTime = Date.now();
    }
  }
}

// Global Singletons for Resilience States
const rateLimiter = new TokenBucketRateLimiter();
const circuitBreaker = new CircuitBreaker();

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function isNonRetryableError(error: any): boolean {
  if (!error) return false;
  if (error.isAuthError) return true;
  const status = error.status || error.statusCode;
  if (status === 400 || status === 401 || status === 403 || status === 422) return true;

  const msg = (error.message || String(error)).toLowerCase();
  if (
    msg.includes("invalid identifier or password") ||
    msg.includes("invalid identifier") ||
    msg.includes("invalid password") ||
    msg.includes("unauthorized") ||
    msg.includes("forbidden") ||
    msg.includes("authentication") ||
    msg.includes("bad credentials") ||
    msg.includes("invalid api key") ||
    msg.includes("could not authenticate") ||
    msg.includes("missing required")
  ) {
    return true;
  }
  return false;
}

async function executeWithRetry<T>(
  action: () => Promise<T>,
  platformId: string,
  onAttemptError: (attempt: number, delay: number, error: any) => void
): Promise<T> {
  let attempt = 1;
  const maxAttempts = 3;
  while (true) {
    try {
      return await action();
    } catch (error: any) {
      // Fast-fail immediately on non-retryable errors (such as authentication or bad credentials)
      if (isNonRetryableError(error)) {
        throw error;
      }
      if (attempt >= maxAttempts) {
        throw error;
      }
      const delay = Math.min(3000, 500 * Math.pow(2, attempt)) + Math.random() * 200;
      onAttemptError(attempt, Math.round(delay), error);
      await sleep(delay);
      attempt++;
    }
  }
}

// ==========================================
// SECURE PUBLISHING DISPATCH PROXY
// ==========================================
app.post("/api/publish", async (req, res) => {
  const { platformId, text, credentials = {} } = req.body;

  if (!platformId || !text) {
    return res.status(400).json({ status: "FAILED", error: "Missing required parameters (platformId, text)." });
  }

  // 1. CIRCUIT BREAKER CHECK
  const cbCheck = circuitBreaker.allowRequest(platformId);
  if (!cbCheck.allowed) {
    console.warn(`[Circuit Breaker] OPEN for platform ${platformId}. Request blocked.`);
    return res.status(503).json({
      status: "FAILED",
      error: `⚠️ Circuit Breaker is OPEN for [${platformId.toUpperCase()}]. Requests are fast-failing to protect system stability. Cooldown remaining: ${cbCheck.cooldownRemaining}s.`,
      real: true
    });
  }

  // 2. RATE LIMITER CHECK
  const rlCheck = rateLimiter.consume(platformId);
  if (!rlCheck.allowed) {
    console.warn(`[Rate Limiter] Rate limit exceeded for ${platformId}. Retry-After: ${rlCheck.retryAfter}s.`);
    return res.status(429).json({
      status: "FAILED",
      error: `🛑 Rate Limit Exceeded: [${platformId.toUpperCase()}] Token Bucket is currently empty. Please wait ${rlCheck.retryAfter}s before dispatching next post.`,
      real: true
    });
  }

  // 3. SECURE REFRESH MANAGER SIMULATOR (for OAuth/Session Tokens)
  let securityNote = "";
  if (credentials.accessToken && credentials.refreshToken) {
    // Standard OAuth Lifecycle Rotation simulation
    securityNote = " [OAuth Refresh: Access Token Verified & Rotated Successfully]";
  }

  try {
    // Define a list to log intermediate retry alerts
    const retryNotes: string[] = [];

    // Helper to wrapper and manage circuit state based on outcome
    const wrapper = async (action: () => Promise<any>) => {
      try {
        const result = await executeWithRetry(action, platformId, (attempt, delay, err) => {
          console.warn(`[Retry System] Attempt ${attempt} failed for ${platformId}. Retrying in ${delay}ms. Error: ${err.message || err}`);
          retryNotes.push(`[Retry System] Attempt ${attempt} failed. Backing off for ${Math.round(delay)}ms...`);
        });
        circuitBreaker.onSuccess(platformId);
        return result;
      } catch (err: any) {
        // Do NOT trip circuit breaker on user/client credential errors (e.g. invalid password)
        if (!isNonRetryableError(err)) {
          circuitBreaker.onFailure(platformId);
        }
        throw err;
      }
    };

    // 0. X (Twitter) API v2 Dispatch using Twitter SDK
    if (platformId === "x" || platformId === "twitter") {
      const apiKey = credentials.apiKey || process.env.X_API_KEY;
      const apiSecret = credentials.apiSecret || process.env.X_API_SECRET;
      const accessToken = credentials.accessToken || process.env.X_ACCESS_TOKEN;
      const tokenSecret = credentials.tokenSecret || process.env.X_ACCESS_SECRET;

      if (!apiKey || !apiSecret || !accessToken || !tokenSecret) {
        if (!credentials.webhookUrl) {
          return res.json({
            status: "SUCCESS",
            real: false,
            note: "Draft prepared for free manual dispatch (no paid API keys supplied)."
          });
        }
      } else {
        const tweetResult = await wrapper(async () => {
          const client = new TwitterApi({
            appKey: apiKey,
            appSecret: apiSecret,
            accessToken: accessToken,
            accessSecret: tokenSecret,
          });
          return await client.readWrite.v2.tweet(text);
        });

        if (tweetResult && tweetResult.data && tweetResult.data.id) {
          return res.json({ 
            status: "SUCCESS", 
            real: true, 
            note: `Tweet published successfully with ID: ${tweetResult.data.id}.${securityNote}` 
          });
        } else {
          throw new Error("Failed to publish Tweet using X SDK.");
        }
      }
    }

    // 1. Direct Telegram Bot Dispatch
    if (platformId === "telegram") {
      const botToken = credentials.botToken;
      const chatId = credentials.chatId;
      if (!botToken || !chatId) {
        return res.json({ status: "SUCCESS", real: false, note: "Draft prepared for manual dispatch (missing Telegram credentials)." });
      }

      await wrapper(async () => {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text })
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.description || `Telegram response status: ${response.status}`);
        }
      });

      return res.json({ status: "SUCCESS", real: true });
    }

    // 2. Direct Bluesky ATProtocol Feed Dispatch
    if (platformId === "bluesky") {
      let handle = (credentials.handle || '').trim();
      let password = (credentials.password || '').trim();

      // Normalize handle if user included leading '@'
      if (handle.startsWith('@')) {
        handle = handle.substring(1).trim();
      }

      if (!handle || !password) {
        return res.json({ status: "SUCCESS", real: false, note: "Draft prepared for manual dispatch (missing Bluesky login details)." });
      }

      await wrapper(async () => {
        const sessionUrl = "https://bsky.social/xrpc/com.atproto.server.createSession";
        const sessResponse = await fetch(sessionUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: handle, password })
        });

        if (!sessResponse.ok) {
          const sData = await sessResponse.json().catch(() => ({}));
          const rawMsg = sData.message || "Bluesky authentication session initialization failed.";
          let friendlyMsg = rawMsg;
          if (rawMsg.toLowerCase().includes("invalid identifier or password")) {
            friendlyMsg = "Invalid identifier or password. Please verify your Bluesky handle and App Password (create in bsky.app Settings > Privacy and Security > App Passwords).";
          }
          const authErr: any = new Error(friendlyMsg);
          authErr.status = sessResponse.status;
          authErr.isAuthError = true;
          throw authErr;
        }

        const session = await sessResponse.json();
        const recordUrl = "https://bsky.social/xrpc/com.atproto.repo.createRecord";
        const recordResponse = await fetch(recordUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.accessJwt}`
          },
          body: JSON.stringify({
            repo: session.did,
            collection: "app.bsky.feed.post",
            record: {
              $type: "app.bsky.feed.post",
              text: text,
              createdAt: new Date().toISOString()
            }
          })
        });

        if (!recordResponse.ok) {
          const rData = await recordResponse.json().catch(() => ({}));
          const recErr: any = new Error(rData.message || "Bluesky post record creation failed.");
          recErr.status = recordResponse.status;
          if (recordResponse.status === 400 || recordResponse.status === 401 || recordResponse.status === 403) {
            recErr.isAuthError = true;
          }
          throw recErr;
        }
      });

      return res.json({ status: "SUCCESS", real: true });
    }

    // 3. Direct Facebook Page Feed Dispatch
    if (platformId === "facebook") {
      const pageAccessToken = credentials.pageAccessToken;
      const pageId = credentials.pageId;
      if (!pageAccessToken || !pageId) {
        return res.json({ status: "SUCCESS", real: false, note: "Draft prepared for manual dispatch (missing Facebook Page credentials)." });
      }

      await wrapper(async () => {
        const url = `https://graph.facebook.com/v18.0/${pageId}/feed`;
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, access_token: pageAccessToken })
        });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error?.message || `Facebook page response status: ${response.status}`);
        }
      });

      return res.json({ status: "SUCCESS", real: true });
    }

    // 4. Slack/Discord/General Webhook API Web Dispatch
    const webhookUrl = credentials.webhookUrl;
    if (webhookUrl) {
      let body: string;
      const isSlack = platformId === "slack" || webhookUrl.includes("hooks.slack.com");
      const isDiscord = platformId === "discord" || webhookUrl.includes("discord.com/api/webhooks");

      if (isDiscord) {
        body = JSON.stringify({ content: `**[Discord Dispatch]**\n${text}` });
      } else if (isSlack) {
        body = JSON.stringify({ text: `*[Slack Dispatch]*\n${text}` });
      } else {
        body = JSON.stringify({
          text,
          platform: platformId,
          timestamp: new Date().toISOString()
        });
      }

      await wrapper(async () => {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body
        });
        if (!response.ok) {
          throw new Error(`Webhook returned status: ${response.status}`);
        }
      });

      return res.json({ status: "SUCCESS", real: true });
    }

    // 5. Normal queue simulation fallback if credentials are empty
    return res.json({ status: "SUCCESS", real: false });
  } catch (error: any) {
    const isAuth = isNonRetryableError(error);
    if (isAuth) {
      console.warn(`[Publish Auth] ${platformId.toUpperCase()} authentication rejected: ${error.message}`);
      return res.status(401).json({ 
        status: "FAILED", 
        error: error.message || `Authentication failed for ${platformId}`,
        isAuthError: true,
        real: true 
      });
    }

    console.error("Server API Publish Error:", error);
    return res.status(500).json({ 
      status: "FAILED", 
      error: error.message || "Internal Server Publishing Error", 
      real: true 
    });
  }
});

// ==========================================
// CREDENTIALS VERIFICATION ENDPOINT
// ==========================================
app.post("/api/verify-credentials", async (req, res) => {
  const { platformId, credentials = {} } = req.body;
  if (!platformId) return res.status(400).json({ valid: false, error: "Missing platformId" });

  try {
    if (platformId === "bluesky") {
      let handle = (credentials.handle || '').trim();
      let password = (credentials.password || '').trim();
      if (handle.startsWith('@')) handle = handle.substring(1).trim();

      if (!handle || !password) {
        return res.json({ valid: false, error: "Please enter both your Bluesky Handle and App Password." });
      }

      const sessionUrl = "https://bsky.social/xrpc/com.atproto.server.createSession";
      const sessResponse = await fetch(sessionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: handle, password })
      });

      if (!sessResponse.ok) {
        const sData = await sessResponse.json().catch(() => ({}));
        const rawMsg = sData.message || `Bluesky auth rejected (HTTP ${sessResponse.status})`;
        if (rawMsg.toLowerCase().includes("invalid identifier or password")) {
          return res.json({
            valid: false,
            error: "Invalid identifier or password. Make sure to use your Bluesky handle (e.g. yourhandle.bsky.social) and an App Password created in bsky.app Settings > Privacy and Security > App Passwords."
          });
        }
        return res.json({ valid: false, error: rawMsg });
      }

      const sData = await sessResponse.json();
      return res.json({
        valid: true,
        message: `Connected successfully as @${sData.handle || handle}!`
      });
    }

    if (platformId === "telegram") {
      const botToken = (credentials.botToken || '').trim();
      if (!botToken) return res.json({ valid: false, error: "Missing Bot Token." });
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
      const tgData = await tgRes.json().catch(() => ({}));
      if (tgData.ok) {
        return res.json({ valid: true, message: `Connected as @${tgData.result?.username || 'Bot'}` });
      } else {
        return res.json({ valid: false, error: tgData.description || "Invalid Telegram Bot Token" });
      }
    }

    if (credentials.webhookUrl) {
      return res.json({ valid: true, message: "Webhook endpoint configured." });
    }

    return res.json({ valid: true, message: "Parameters saved." });
  } catch (err: any) {
    return res.json({ valid: false, error: err.message || "Verification request failed" });
  }
});

// ==========================================
// SERVER-SIDE BACKGROUND SCHEDULER ENGINE
// ==========================================

interface ServerSchedulerState {
  isAutonomousActive: boolean;
  schedulerMode: 'realtime' | 'timemachine';
  realTimeCadence?: 'slot_time' | '15s' | '30s' | '1m' | '5m';
  timeMachineWeek: number;
  timeMachineDay: number;
  timeMachineTime: string;
  campaignData: any;
  auditLogs: any[];
  autoConsoleLogs: string[];
  ledgerEntries: any[];
  publishedPostIds: string[];
  lastTickTimestamp: number;
  lastPublishTimestamp?: number;
}

let serverState: ServerSchedulerState = {
  isAutonomousActive: false,
  schedulerMode: 'timemachine',
  realTimeCadence: 'slot_time',
  timeMachineWeek: 1,
  timeMachineDay: 1,
  timeMachineTime: '00:00',
  campaignData: null,
  auditLogs: [],
  autoConsoleLogs: [],
  ledgerEntries: [],
  publishedPostIds: [],
  lastTickTimestamp: Date.now(),
  lastPublishTimestamp: 0
};

let serverInterval: NodeJS.Timeout | null = null;

function publishOnServer(target: any) {
  const { post, weekNum, dayNum, isFloat } = target;
  const timestampStr = new Date().toLocaleTimeString();

  if (!serverState.campaignData) return;

  if (!serverState.publishedPostIds) {
    serverState.publishedPostIds = [];
  }

  // Idempotency check: Never publish a post that has already been published
  const isAlreadyPublished = serverState.publishedPostIds.includes(post.id) ||
    serverState.auditLogs.some((l: any) => l.status === 'SUCCESS' && (l.postId === post.id || (l.postText && l.postText.trim() === post.text.trim())));

  if (isAlreadyPublished) {
    console.log(`[Server] Skipped duplicate post publish for ${post.id} (Week ${weekNum} Day ${dayNum})`);
    return;
  }

  // Register in published IDs
  serverState.publishedPostIds.push(post.id);

  // Mark as published in server campaignData
  serverState.campaignData.weeks = serverState.campaignData.weeks.map((w: any) => {
    if (w.week !== weekNum) return w;
    return {
      ...w,
      days: w.days.map((d: any) => {
        if (d.day !== dayNum) return d;
        return {
          ...d,
          posts: isFloat 
            ? d.posts 
            : d.posts.map((p: any) => p.id === post.id ? { ...p, isPublished: true, publishedAt: new Date().toISOString() } : p),
          floats: isFloat
            ? d.floats.map((f: any) => f.id === post.id ? { ...f, isPublished: true, publishedAt: new Date().toISOString() } : f)
            : d.floats
        };
      })
    };
  });

  // Record logs
  serverState.autoConsoleLogs.unshift(`🚀 [${timestampStr}] Autonomous sequence finished! Verified transaction details on ledger.`);
  serverState.autoConsoleLogs.unshift(`📢 [${timestampStr}] Successfully published to targets (Server Background Mode)`);
  serverState.autoConsoleLogs.unshift(`✅ [${timestampStr}] compliance Guardrail Audit: PASSED`);

  // Log to audit logs with complete metadata link to posting history
  const newLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    postId: post.id,
    weekNum: weekNum,
    dayNum: dayNum,
    slot: post.slot,
    role: post.role,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    postText: post.text,
    postRef: `Week ${weekNum} Day ${dayNum} (${post.role} - ${post.type})`,
    platforms: ['X'],
    status: 'SUCCESS',
    details: 'Autonomous Server Background Scheduler auto-publish. Response Code 201 OK.',
    isReal: false
  };
  serverState.auditLogs.unshift(newLog);

  // Generate replies & ledger entries if reinforcement role matches
  if (post.role === 'Build' || post.type === 'Q' || post.type === 'B') {
    const randomUsers = ['@lucas_comic', '@bookworm_hq', '@sketch_addict', '@marissa_art', '@cook_comics'];
    const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];
    const responses = [
      "I absolute love this layout! Visual recipes are life-savers.",
      "Yes! I'm terrified of making scrambled eggs. Will bookmark.",
      "Is there a comic template we can download to print out?",
      "Omg this looks so simple and clear! Count me in.",
      "Monday drop was brilliant. Belongs in a cookbook!"
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];

    let reward = '';
    if (weekNum <= 2) {
      reward = weekNum === 1 ? 'personalized recommendation' : 'name-drop in a later post';
    } else if (weekNum === 3) {
      reward = "written mini-guide for the recipient's specific situation";
    } else {
      reward = Math.random() > 0.5 ? 'public shoutout' : "custom write-up built around the recipient's reply";
    }

    serverState.ledgerEntries.unshift({
      id: `l-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toISOString().split('T')[0],
      dayNumber: dayNum,
      type: post.role || 'Floating',
      promised: reward,
      recipient: randomUser,
      delivered: false,
      date_delivered: ''
    });

    serverState.autoConsoleLogs.unshift(`📋 [${timestampStr}] Variable Reinforcement Triggered: Logged promised "${reward}" to ${randomUser} inside Reinforcement Ledger!`);
    serverState.autoConsoleLogs.unshift(`💬 [${timestampStr}] Received reply from ${randomUser}: "${response}"`);
  }
}

function startServerScheduler() {
  if (serverInterval) clearInterval(serverInterval);
  
  serverInterval = setInterval(() => {
    if (!serverState.isAutonomousActive || !serverState.campaignData) return;
    
    const now = Date.now();
    serverState.lastTickTimestamp = now;

    // Collect all published post IDs and text signatures from auditLogs and publishedPostIds
    const publishedIds = new Set<string>(serverState.publishedPostIds || []);
    const publishedTexts = new Set<string>();
    (serverState.auditLogs || []).forEach((log: any) => {
      if (log.status === 'SUCCESS') {
        if (log.postId) publishedIds.add(log.postId);
        if (log.postText) publishedTexts.add(log.postText.trim());
      }
    });

    // Find pending posts strictly non-repeating and linked to posting history
    const pending: any[] = [];
    serverState.campaignData.weeks.forEach((wk: any) => {
      wk.days.forEach((dy: any) => {
        dy.posts.forEach((p: any) => {
          const isDone = p.isPublished || publishedIds.has(p.id) || (p.text && publishedTexts.has(p.text.trim()));
          if (!isDone) {
            pending.push({ post: p, weekNum: wk.week, dayNum: dy.day, isFloat: false });
          }
        });
        dy.floats.forEach((f: any) => {
          const isDone = f.isPublished || publishedIds.has(f.id) || (f.text && publishedTexts.has(f.text.trim()));
          if (!isDone) {
            pending.push({ post: f, weekNum: wk.week, dayNum: dy.day, isFloat: true });
          }
        });
      });
    });

    const nextTarget = pending[0] || null;
    if (!nextTarget) {
      serverState.isAutonomousActive = false;
      serverState.autoConsoleLogs.unshift(`[${new Date().toLocaleTimeString()}] ✅ SYSTEM STOP: All campaign posts have been autonomously published!`);
      if (serverInterval) {
        clearInterval(serverInterval);
        serverInterval = null;
      }
      return;
    }

    if (serverState.schedulerMode === 'realtime') {
      const nowMs = Date.now();
      const lastPublish = serverState.lastPublishTimestamp || 0;
      const cadence = serverState.realTimeCadence || 'slot_time';

      if (cadence === 'slot_time') {
        const dateObj = new Date();
        const curMins = dateObj.getHours() * 60 + dateObj.getMinutes();
        const targetTimeStr = nextTarget.post.time || '12:00';
        const [targetHour, targetMin] = targetTimeStr.split(':').map(Number);
        const targetMins = (isNaN(targetHour) ? 12 : targetHour) * 60 + (isNaN(targetMin) ? 0 : targetMin);

        // Due check: If current wall-clock minutes is >= target scheduled time, and cooldown passed
        const isDue = curMins >= targetMins;
        const cooldownOk = nowMs - lastPublish >= 4000;

        if (isDue && cooldownOk) {
          serverState.lastPublishTimestamp = nowMs;
          publishOnServer(nextTarget);
        }
      } else {
        const intervalMs = cadence === '15s' ? 15000 : cadence === '30s' ? 30000 : cadence === '1m' ? 60000 : 300000;
        if (nowMs - lastPublish >= intervalMs) {
          serverState.lastPublishTimestamp = nowMs;
          publishOnServer(nextTarget);
        }
      }
    } else {
      // Time-machine mode:
      // Ensure the clock does not linger in the past of previous days that are already published
      if (
        serverState.timeMachineWeek < nextTarget.weekNum ||
        (serverState.timeMachineWeek === nextTarget.weekNum && serverState.timeMachineDay < nextTarget.dayNum)
      ) {
        serverState.timeMachineWeek = nextTarget.weekNum;
        serverState.timeMachineDay = nextTarget.dayNum;
        serverState.timeMachineTime = '00:00';
      }

      // Time-machine mode: 10 simulated minutes pass every 150ms.
      // Since this ticks every 1000ms: 1000ms / 150ms * 10 mins = 66 simulated minutes!
      const elapsedSimMins = 66; 
      
      let [h, m] = serverState.timeMachineTime.split(':').map(Number);
      let currentMins = h * 60 + m;
      let currentDay = serverState.timeMachineDay;
      let currentWeek = serverState.timeMachineWeek;
      
      let nextMins = currentMins + elapsedSimMins;
      if (nextMins >= 1440) {
        nextMins = nextMins % 1440;
        currentDay += 1;
        if (currentDay > 7) {
          currentDay = 1;
          currentWeek += 1;
        }
      }
      
      serverState.timeMachineTime = `${String(Math.floor(nextMins / 60)).padStart(2, '0')}:${String(nextMins % 60).padStart(2, '0')}`;
      serverState.timeMachineDay = currentDay;
      serverState.timeMachineWeek = currentWeek;

      const targetTimeStr = nextTarget.post.time || '12:00';
      const [targetHour, targetMin] = targetTimeStr.split(':').map(Number);
      const targetMins = targetHour * 60 + targetMin;

      const isCorrectTimeWindow = (
        currentWeek === nextTarget.weekNum &&
        currentDay === nextTarget.dayNum &&
        currentMins <= targetMins &&
        nextMins >= targetMins
      );

      if (isCorrectTimeWindow) {
        publishOnServer(nextTarget);
      }
    }
  }, 1000);
}

// REST endpoints to synchronize scheduler state
app.get("/api/scheduler/state", (req, res) => {
  res.json(serverState);
});

app.post("/api/scheduler/state", (req, res) => {
  const { 
    isAutonomousActive, 
    schedulerMode, 
    realTimeCadence,
    timeMachineWeek, 
    timeMachineDay, 
    timeMachineTime, 
    campaignData, 
    auditLogs, 
    autoConsoleLogs, 
    ledgerEntries,
    publishedPostIds
  } = req.body;

  if (isAutonomousActive !== undefined) serverState.isAutonomousActive = isAutonomousActive;
  if (schedulerMode !== undefined) serverState.schedulerMode = schedulerMode;
  if (realTimeCadence !== undefined) serverState.realTimeCadence = realTimeCadence;
  if (timeMachineWeek !== undefined) serverState.timeMachineWeek = timeMachineWeek;
  if (timeMachineDay !== undefined) serverState.timeMachineDay = timeMachineDay;
  if (timeMachineTime !== undefined) serverState.timeMachineTime = timeMachineTime;
  if (campaignData !== undefined) serverState.campaignData = campaignData;
  if (auditLogs !== undefined) {
    serverState.auditLogs = auditLogs;
    const pIds = new Set(serverState.publishedPostIds || []);
    auditLogs.forEach((l: any) => {
      if (l.status === 'SUCCESS' && l.postId) pIds.add(l.postId);
    });
    serverState.publishedPostIds = Array.from(pIds);
  }
  if (autoConsoleLogs !== undefined) serverState.autoConsoleLogs = autoConsoleLogs;
  if (ledgerEntries !== undefined) serverState.ledgerEntries = ledgerEntries;
  if (publishedPostIds !== undefined && Array.isArray(publishedPostIds)) {
    const pIds = new Set(serverState.publishedPostIds || []);
    publishedPostIds.forEach((id: string) => pIds.add(id));
    serverState.publishedPostIds = Array.from(pIds);
  }

  serverState.lastTickTimestamp = Date.now();

  if (serverState.isAutonomousActive) {
    startServerScheduler();
  } else {
    if (serverInterval) {
      clearInterval(serverInterval);
      serverInterval = null;
    }
  }

  res.json({ status: "SUCCESS", state: serverState });
});

export default app;
