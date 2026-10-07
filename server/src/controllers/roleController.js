import Role from "../models/Role.js";
import Profile from "../models/Profile.js";

// GET /api/roles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find()
      .populate("requiredSkills.skill")
      .sort({ title: 1 });
    res.json({ roles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/roles/target
export const getMyTargetRole = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id }).populate({
      path: "targetRole",
      populate: { path: "requiredSkills.skill" },
    });
    res.json({ role: profile?.targetRole || null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/roles/target
export const setMyTargetRole = async (req, res) => {
  try {
    const { roleId } = req.body;

    if (!roleId) {
      return res.status(400).json({ message: "roleId is required" });
    }

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: { targetRole: roleId } },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    res.json({ message: "Target role saved", roleId });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};