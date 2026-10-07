import Skill from "../models/Skill.js";
import UserSkill from "../models/UserSkill.js";

// GET /api/skills  (master list)
export const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    res.json({ skills });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/skills/me
export const getMySkills = async (req, res) => {
  try {
    const userSkills = await UserSkill.find({ user: req.user._id })
      .populate("skill")
      .sort({ createdAt: -1 });
    res.json({ userSkills });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/skills/me
export const addMySkill = async (req, res) => {
  try {
    const { skillId, level } = req.body;

    if (!skillId) {
      return res.status(400).json({ message: "skillId is required" });
    }

    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    const userSkill = await UserSkill.create({
      user: req.user._id,
      skill: skillId,
      level: Number(level) || 1,
    });

    await userSkill.populate("skill");
    res.status(201).json({ userSkill });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Skill already added" });
    }
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/skills/me/:id
export const updateMySkill = async (req, res) => {
  try {
    const userSkill = await UserSkill.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { level: Number(req.body.level) },
      { returnDocument: "after", runValidators: true }
    ).populate("skill");

    if (!userSkill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.json({ userSkill });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/skills/me/:id
export const deleteMySkill = async (req, res) => {
  try {
    const userSkill = await UserSkill.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!userSkill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.json({ message: "Skill removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};