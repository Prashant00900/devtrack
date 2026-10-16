// Simple in-memory limiter (IP ke hisaab se)
export const createLimiter = ({ windowMs, max, message }) => {
  const hits = new Map();

  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);

    if (recent.length >= max) {
      return res.status(429).json({ message });
    }

    if (hits.size > 5000) hits.clear();

    recent.push(now);
    hits.set(key, recent);
    next();
  };
};