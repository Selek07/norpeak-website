const LOCAL_API_BASE = "http://localhost:5000/api";
// The API runs on Render's free tier, which spins the instance down when idle.
// A cold start regularly takes 30-50s, so a short timeout would abort the very
// first submission after a quiet period — the common case for a real visitor.
const REQUEST_TIMEOUT_MS = 60000;
const TIMEOUT_MESSAGE = "The request timed out. Please try again.";
const API_BASE = resolveApiBaseUrl();

const request = async (path, { headers, ...options } = {}) => {
  if (!API_BASE) {
    throw new Error(
      "API base URL is not configured. Set EXPO_PUBLIC_API_URL for deployed builds."
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  // The timer stays armed until the body is parsed — a server that sends
  // headers promptly and then stalls mid-body would otherwise hang forever.
  try {
    let response;
    try {
      response = await fetch(`${API_BASE}${normalizePath(path)}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(headers || {}),
        },
        signal: controller.signal,
      });
    } catch (error) {
      throw new Error(
        error.name === "AbortError"
          ? TIMEOUT_MESSAGE
          : "Unable to reach the server. Please check your connection and try again."
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error(TIMEOUT_MESSAGE);
      }
      data = {};
    }

    if (!response.ok) {
      throw new Error(data.message || "Request failed.");
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
};

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, "");
}

function normalizePath(path) {
  return path.startsWith("/") ? path : `/${path}`;
}

function resolveApiBaseUrl() {
  const explicitBase = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (explicitBase) {
    return normalizeBaseUrl(explicitBase);
  }

  if (isLocalDevelopmentHost()) {
    return LOCAL_API_BASE;
  }

  return null;
}

function isLocalDevelopmentHost() {
  if (typeof window === "undefined") {
    return process.env.NODE_ENV !== "production";
  }

  return ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

let hasWarmedUp = false;

// The API sleeps on Render's free tier and takes 30-50s to wake. Nudge it as
// soon as the visitor starts filling the form so the instance is already up by
// the time they submit. Fire-and-forget: failures are irrelevant here.
export const warmUpApi = () => {
  if (hasWarmedUp || !API_BASE) {
    return;
  }

  hasWarmedUp = true;
  fetch(`${API_BASE}/health`, { method: "GET" }).catch(() => {});
};

export const submitContact = (payload) =>
  request("/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
