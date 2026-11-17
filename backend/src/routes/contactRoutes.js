import express from "express";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";

import { isDatabaseReady } from "../lib/db.js";
import { sendContactNotification } from "../lib/mailer.js";
import ContactMessage from "../models/ContactMessage.js";

const router = express.Router();

// This service sits behind Cloudflare AND Render's load balancer, so
// X-Forwarded-For carries two entries and req.ip resolves to Cloudflare's edge
// under any fixed `trust proxy` hop count — which would put every visitor
// sharing an edge into the same bucket. Cloudflare overwrites CF-Connecting-IP
// with the true client address on every request and a client cannot forge it
// through the edge, so prefer it and fall back to req.ip when absent.
const clientIpKey = (req) => {
  const cfConnectingIp = req.headers["cf-connecting-ip"];
  const ip =
    typeof cfConnectingIp === "string" && cfConnectingIp.length > 0
      ? cfConnectingIp
      : req.ip;

  return ipKeyGenerator(ip);
};

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  keyGenerator: clientIpKey,
  message: { message: "Too many requests. Please try again later." },
});

// Mirrors the ContactMessage schema limits so oversized input fails fast with
// a 400 instead of a Mongoose 500 (or an unbounded email when the DB is down).
const FIELD_LIMITS = {
  name: 100,
  email: 254,
  company: 150,
  subject: 200,
  message: 5000,
};

const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value).toLowerCase());

const asTrimmedString = (value) => (typeof value === "string" ? value.trim() : "");

const findValidationError = (payload) => {
  if (!payload.name || !payload.email || !payload.message) {
    return "Name, email, and message are required.";
  }

  if (!isValidEmail(payload.email)) {
    return "Please provide a valid email.";
  }

  for (const [field, max] of Object.entries(FIELD_LIMITS)) {
    if (payload[field].length > max) {
      return `The ${field} field must be ${max} characters or fewer.`;
    }
  }

  return "";
};

router.post("/", contactLimiter, async (req, res) => {
  try {
    const body = req.body || {};
    const payload = {
      name: asTrimmedString(body.name),
      email: asTrimmedString(body.email),
      company: asTrimmedString(body.company),
      subject: asTrimmedString(body.subject),
      message: asTrimmedString(body.message),
    };

    const validationError = findValidationError(payload);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    let stored = false;
    let delivered = false;

    if (isDatabaseReady()) {
      try {
        await ContactMessage.create(payload);
        stored = true;
      } catch (error) {
        // A failed write should not stop the email notification below.
        console.error("Contact store error:", error);
      }
    }

    try {
      const result = await sendContactNotification(payload);
      delivered = result.sent;
      if (!result.sent && result.reason) {
        console.warn("Contact delivery warning:", result.reason);
      }
    } catch (error) {
      console.warn("Contact delivery warning:", error.message);
    }

    if (!stored && !delivered) {
      return res.status(503).json({
        message: "Unable to save or send the message right now. Please try again later.",
        stored,
        delivered,
      });
    }

    return res.status(201).json({
      message: delivered
        ? "Message sent successfully."
        : "Message saved successfully, but email delivery is currently unavailable.",
      stored,
      delivered,
    });
  } catch (error) {
    console.error("Contact route error:", error);
    return res.status(500).json({
      message: "Unable to process the contact request right now.",
    });
  }
});

export default router;
