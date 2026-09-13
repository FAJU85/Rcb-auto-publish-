import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Support JSON payload parsing
  app.use(express.json());

  // Professional health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
  });

  // Secure Server-side API Proxy for Publishing
  // Eliminates browser-side CORS blocks entirely
  app.post("/api/publish", async (req, res) => {
    try {
      const { platformId, text, credentials = {} } = req.body;

      if (!platformId || !text) {
        return res.status(400).json({ status: "FAILED", error: "Missing required parameters (platformId, text)." });
      }

      // 1. Direct Telegram Bot Dispatch
      if (platformId === "telegram") {
        const { botToken, chatId } = credentials;
        if (!botToken || !chatId) {
          return res.json({ status: "SUCCESS", real: false, note: "Draft prepared for manual dispatch (missing Telegram bot credentials)." });
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
        const { handle, password } = credentials;
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
        const { pageAccessToken, pageId } = credentials;
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

  // Mount Vite development server middleware (in development mode)
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    // Serve static client bundle assets (in production mode)
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Production-ready full-stack server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
