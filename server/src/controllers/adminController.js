import User from "../models/User.js";
import Skill from "../models/Skill.js";
import UserSkill from "../models/UserSkill.js";
import Project from "../models/Project.js";
import Profile from "../models/Profile.js";
import Certification from "../models/Certification.js";
import RoadmapProgress from "../models/RoadmapProgress.js";
import Resource from "../models/Resource.js";
import { DEFAULT_RESOURCES } from "../data/defaultResources.js";

const DAY = 24 * 60 * 60 * 1000;
const ROLES = ["developer", "mentor", "admin"];

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// GET /api/admin/stats
export const getStats = async (req, res) => {
  try {
    const since = new Date(Date.now() - 7 * DAY);

    const [
      users,
      googleUsers,
      newUsers,
      projects,
      certifications,
      skillEntries,
      recentUsers,
      topAgg,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ googleId: { $exists: true, $ne: null } }),
      User.countDocuments({ createdAt: { $gte: since } }),
      Project.countDocuments(),
      Certification.countDocuments(),
      UserSkill.countDocuments(),
      User.find().sort({ createdAt: -1 }).limit(5).select("name email role createdAt"),
      UserSkill.aggregate([
        { $group: { _id: "$skill", count: { $sum: 1 }, avgLevel: { $avg: "$level" } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
    ]);

    const skills = await Skill.find({ _id: { $in: topAgg.map((t) => t._id) } });
    const nameById = Object.fromEntries(skills.map((s) => [s._id.toString(), s.name]));

    const topSkills = topAgg.map((t) => ({
      name: nameById[t._id.toString()] || "Unknown",
      count: t.count,
      avgLevel: Number(t.avgLevel.toFixed(1)),
    }));

    res.json({
      users,
      googleUsers,
      newUsers,
      projects,
      certifications,
      skillEntries,
      recentUsers,
      topSkills,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/admin/users?search=
export const getUsers = async (req, res) => {
  try {
    const q = String(req.query.search || "").trim();
    const filter = q
      ? {
          $or: [
            { name: new RegExp(escapeRegex(q), "i") },
            { email: new RegExp(escapeRegex(q), "i") },
          ],
        }
      : {};

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .select("name email role googleId createdAt");

    res.json({
      users: users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        provider: u.googleId ? "google" : "password",
        createdAt: u.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/admin/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!ROLES.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { returnDocument: "after" }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Role updated" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own account" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const id = user._id;
    await Promise.all([
      UserSkill.deleteMany({ user: id }),
      Project.deleteMany({ user: id }),
      Profile.deleteMany({ user: id }),
      Certification.deleteMany({ user: id }),
      RoadmapProgress.deleteMany({ user: id }),
    ]);
    await user.deleteOne();

    res.json({ message: "User deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// GET /api/admin/resources
export const getAdminResources = async (req, res) => {
  try {
    const resources = await Resource.find()
      .populate("skill")
      .sort({ createdAt: -1 })
      .limit(300);

    res.json({ resources: resources.filter((r) => r.skill) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/admin/resources
export const createResource = async (req, res) => {
  try {
    const { skillId, title, url, type } = req.body;

    if (!skillId || !title || !url) {
      return res.status(400).json({ message: "Skill, title and url are required" });
    }

    if (!/^https?:\/\//i.test(url)) {
      return res.status(400).json({ message: "URL must start with http:// or https://" });
    }

    const skill = await Skill.findById(skillId);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    const resource = await Resource.create({
      skill: skillId,
      title,
      url,
      type: type || "docs",
    });

    res.status(201).json({ resource });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "This link already exists for this skill" });
    }
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/admin/resources/:id
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.json({ message: "Resource deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST /api/admin/resources/seed-defaults
export const seedDefaultResources = async (req, res) => {
  try {
    const skills = await Skill.find();
    const idByName = Object.fromEntries(skills.map((s) => [s.name, s._id]));

    let added = 0;
    for (const [skillName, title, url, type] of DEFAULT_RESOURCES) {
      const skillId = idByName[skillName];
      if (!skillId) continue;

      const result = await Resource.updateOne(
        { skill: skillId, url },
        { $setOnInsert: { title, type, isFree: true } },
        { upsert: true }
      );

      if (result.upsertedCount) added += 1;
    }

    res.json({ added, total: DEFAULT_RESOURCES.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};