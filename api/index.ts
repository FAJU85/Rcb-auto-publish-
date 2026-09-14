import express from "express";
import { TwitterApi } from "twitter-api-v2";

const app = express();

// Support JSON payload parsing
app.use(express.json());

// Professional health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Secure Server-side API Proxy for Publishing
// Eliminates browser-side CORS blocks entirely and operates on Vercel or local containers
app.post("/api/publish", async (req, res) => {
  try {
    const { platformId, text, credentials = {} } = req.body;

    if (!platformId || !text) {
      return res.status(400).json({ status: "FAILED", error: "Missing required parameters (platformId, text)." });
    }

    // 0. Direct X (Twitter) API v2 Dispatch using Twitter SDK
    if (platformId === "x" || platformId === "twitter") {
      // Only use credentials supplied explicitly by the user or defined in their own custom backend process.env keys
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
        try {
          const client = new TwitterApi({
            appKey: apiKey,
            appSecret: apiSecret,
            accessToken: accessToken,
            accessSecret: tokenSecret,
          });

          const rwClient = client.readWrite;
          const tweetResult = await rwClient.v2.tweet(text);

          if (tweetResult && tweetResult.data && tweetResult.data.id) {
            return res.json({ status: "SUCCESS", real: true, note: `Tweet published successfully with ID: ${tweetResult.data.id}` });
          } else {
            return res.status(500).json({ status: "FAILED", error: "Failed to publish Tweet using X SDK.", real: true });
          }
        } catch (err: any) {
          console.error("X SDK Post Error:", err);
          
          let friendlyError = err.message || "X SDK credential authorization error.";
          const errStr = String(err.message || "") + " " + String(err || "");
          
          if (err.statusCode === 402 || errStr.includes("402") || err.code === 402) {
            friendlyError = "𝕏 API Error (402 Payment Required): Your X Developer App requires a paid subscription tier (Basic, Pro, or Enterprise) to publish tweets automatically via the API. Please visit your X Developer Portal (https://developer.x.com) to upgrade your developer tier or configure billing.";
          } else if (err.statusCode === 403 || errStr.includes("403") || err.code === 403) {
            friendlyError = "𝕏 API Error (403 Forbidden): Your credentials do not have write permissions. Please go to your X Developer Portal, set App Permissions to 'Read and Write' under User Authentication Settings, and then regenerate your Access Token & Secret.";
          }
          
          return res.status(500).json({ status: "FAILED", error: friendlyError, real: true });
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

      const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text })
      });

      if (response.ok) {
        return res.json({ status: "SUCCESS", real: true });
      } else {
        const data = await response.json().catch(() => ({}));
        return res.status(response.status).json({ status: "FAILED", error: data.description || `Telegram response status: ${response.status}`, real: true });
      }
    }

    // 2. Direct Bluesky ATProtocol Feed Dispatch
    if (platformId === "bluesky") {
      const handle = credentials.handle;
      const password = credentials.password;
      if (!handle || !password) {
        return res.json({ status: "SUCCESS", real: false, note: "Draft prepared for manual dispatch (missing Bluesky login details)." });
      }

      const sessionUrl = "https://bsky.social/xrpc/com.atproto.server.createSession";
      const sessResponse = await fetch(sessionUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: handle, password })
      });

      if (sessResponse.ok) {
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

        if (recordResponse.ok) {
          return res.json({ status: "SUCCESS", real: true });
        } else {
          const rData = await recordResponse.json().catch(() => ({}));
          return res.status(recordResponse.status).json({ status: "FAILED", error: rData.message || "Bluesky post record creation failed.", real: true });
        }
      } else {
        const sData = await sessResponse.json().catch(() => ({}));
        return res.status(sessResponse.status).json({ status: "FAILED", error: sData.message || "Bluesky authentication session initialization failed.", real: true });
      }
    }

    // 3. Direct Facebook Page Feed Dispatch
    if (platformId === "facebook") {
      const pageAccessToken = credentials.pageAccessToken;
      const pageId = credentials.pageId;
      if (!pageAccessToken || !pageId) {
        return res.json({ status: "SUCCESS", real: false, note: "Draft prepared for manual dispatch (missing Facebook Page credentials)." });
      }

      const url = `https://graph.facebook.com/v18.0/${pageId}/feed`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, access_token: pageAccessToken })
      });

      if (response.ok) {
        return res.json({ status: "SUCCESS", real: true });
      } else {
        const data = await response.json().catch(() => ({}));
        return res.status(response.status).json({ status: "FAILED", error: data.error?.message || `Facebook page response status: ${response.status}`, real: true });
      }
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

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
      });

      if (response.ok) {
        return res.json({ status: "SUCCESS", real: true });
      } else {
        return res.status(response.status).json({ status: "FAILED", error: `Webhook returned status: ${response.status}`, real: true });
      }
    }

    // 5. Normal queue simulation fallback if credentials are empty
    return res.json({ status: "SUCCESS", real: false });
  } catch (error: any) {
    console.error("Server API Publish Error:", error);
    return res.status(500).json({ status: "FAILED", error: error.message || "Internal Server Publishing Error", real: true });
  }
});

export default app;
