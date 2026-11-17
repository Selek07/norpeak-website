import cors from "cors";
import "dotenv/config";
import express from "express";

import { connectDB, disconnectDB, isDatabaseReady } from "./lib/db.js";
import contactRoutes from "./routes/contactRoutes.js";

const REQUIRED_ENV_VARS = ["RESEND_API_KEY", "CONTACT_TO_EMAIL"];
const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
  console.error(`Missing required environment variables: ${missingVars.join(", ")}`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV !== "production";

// Requests reach this app through Cloudflare and then Render's load balancer
// (responses carry both CF-RAY and rndr-id), so client IPs arrive via
// X-Forwarded-For. Trusting one hop keeps req.ip un-spoofable; the contact
// limiter does not rely on it — see the CF-Connecting-IP key in contactRoutes.
app.set("trust proxy", Number(process.env.TRUST_PROXY ?? 1));
app.disable("x-powered-by");

const normalizeOrigin = (origin) => origin.trim().replace(/\/+$/, "");
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
      .map(normalizeOrigin)
  : [];
const corsOptions = {
  origin: (origin, callback) => {
    // Same-origin or server-to-server requests (no Origin header) — always allow
    if (!origin) return callback(null, true);
    // In development with no CLIENT_URL set, allow everything for convenience
    if (isDev && !allowedOrigins.length) return callback(null, true);
    // Disallowed origins get a response without CORS headers (the browser
    // blocks it); passing an Error here would surface as a 500 instead.
    const isAllowed = allowedOrigins.includes(normalizeOrigin(origin));
    if (!isAllowed) {
      // Without this log a misconfigured CLIENT_URL looks like a silent
      // client-side failure with nothing on the server to point at it.
      console.warn(`Blocked CORS request from origin: ${origin}`);
    }
    return callback(null, isAllowed);
  },
  optionsSuccessStatus: 204,
};

// The contact form payload tops out around 6 KB; anything larger is abuse.
app.use(express.json({ limit: "50kb" }));
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    database: isDatabaseReady() ? "connected" : "disabled",
  });
});

app.use("/api/contact", contactRoutes);

const server = app.listen(PORT, async () => {
  console.log(`Portfolio API listening on port ${PORT}`);
  try {
    await connectDB();
  } catch (error) {
    console.error("Failed to connect to database:", error.message);
  }
});

// Render sends SIGTERM on every deploy; drain in-flight requests and close
// the Mongo connection instead of dropping them.
const shutdown = (signal) => {
  console.log(`${signal} received, shutting down gracefully...`);
  server.close(async () => {
    try {
      await disconnectDB();
    } catch (error) {
      console.error("Error closing database connection:", error.message);
    }
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};

["SIGTERM", "SIGINT"].forEach((signal) => {
  process.on(signal, () => shutdown(signal));
});
