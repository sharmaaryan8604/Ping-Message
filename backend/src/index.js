import dns from "dns";

dns.setServers([
  "8.8.8.8",
  "8.8.4.4",
]);

import "./lib/env.js";

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { clerkMiddleware } from "@clerk/express";

import { connectDb } from "./lib/db.js";
import job from "./lib/cron.js";

import clerkWebhook from "./webhooks/clerk.webhook.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { app, server } from "./lib/socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(
  process.env.PORT ?? process.env.port ?? 3000
);

const FRONTEND_URL =
  process.env.FRONTEND_URL;

const publicDir = path.resolve(
  __dirname,
  "../public"
);

// =====================================================
// DEBUG
// =====================================================

console.log(
  "Clerk secret key loaded:",
  process.env.CLERK_SECRET_KEY
    ? "YES"
    : "NO"
);

console.log(
  "Clerk secret key prefix:",
  process.env.CLERK_SECRET_KEY?.slice(0, 8)
);

// =====================================================
// CLERK MIDDLEWARE
// IMPORTANT: MUST BE BEFORE OTHER MIDDLEWARE
// =====================================================

app.use(clerkMiddleware());

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

// =====================================================
// CLERK WEBHOOK
// =====================================================

app.use(
  "/api/webhooks/clerk",
  express.raw({
    type: "application/json",
  }),
  clerkWebhook
);

// =====================================================
// JSON BODY PARSER
// =====================================================

app.use(express.json());

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/health", (req, res) => {
  res.status(200).json({
    message: "Hello, World!",
  });
});

// =====================================================
// API ROUTES
// =====================================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/messages",
  messageRoutes
);

// =====================================================
// SERVE FRONTEND IN PRODUCTION
// =====================================================

if (fs.existsSync(publicDir)) {
  app.use(
    express.static(publicDir)
  );

  app.get(
    "/*any",
    (req, res, next) => {
      res.sendFile(
        path.join(
          publicDir,
          "index.html"
        ),
        (err) => {
          if (err) {
            next(err);
          }
        }
      );
    }
  );
}

// =====================================================
// START SERVER
// =====================================================

const startServer = async () => {
  try {
    await connectDb();

    console.log(
      "Connected to MongoDB"
    );

    server.listen(PORT, () => {
      console.log(
        `Server is running on port ${PORT}`
      );

      if (
        process.env.NODE_ENV ===
        "production"
      ) {
        job.start();
      }
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );

    process.exit(1);
  }
};

startServer();