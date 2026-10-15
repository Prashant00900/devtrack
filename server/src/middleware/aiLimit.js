// Free AI key ki limit bachane ke liye: ek user ke ek ghante mein 40 AI requests
const WINDOW_MS = 60 * 60 * 1000;
const MAX_CALLS = 40;
const hits = new Map();

export const aiLimit = (req, res, next) => {
  const key = req.user._id.toString();
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_CALLS) {
    return res.status(429).json({
      message: "Ek ghante mein AI ke 40 requests ho gaye. Thodi der baad try karo.",
    });
  }

  recent.push(now);
  hits.set(key, recent);
  next();
};