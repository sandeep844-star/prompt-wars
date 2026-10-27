// Simple sliding window rate limiter
const ipRequests = new Map();

export function rateLimit({ windowMs = 60000, max = 30, message = 'Too many requests, please try again shortly.' } = {}) {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress || 'client';
    const now = Date.now();

    if (!ipRequests.has(key)) {
      ipRequests.set(key, []);
    }

    const timestamps = ipRequests.get(key).filter(time => now - time < windowMs);
    if (timestamps.length >= max) {
      return res.status(429).json({ error: message });
    }

    timestamps.push(now);
    ipRequests.set(key, timestamps);
    next();
  };
}
