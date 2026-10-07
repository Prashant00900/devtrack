import { getPromotionReadiness } from "../services/promotionService.js";

// GET /api/promotion/readiness
export const getReadiness = async (req, res) => {
  try {
    const result = await getPromotionReadiness(req.user._id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};