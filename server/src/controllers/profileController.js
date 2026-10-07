import Profile from "../models/Profile.js";

// GET /api/profile
export const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $setOnInsert: { headline: "" } },
      { upsert: true, returnDocument: "after" }
    );
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/profile
export const updateMyProfile = async (req, res) => {
  try {
    const allowed = [
      "headline",
      "bio",
      "collegeOrCompany",
      "experienceLevel",
      "location",
      "githubUsername",
      "linkedinUrl",
    ];

    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: updates },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json({ profile });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};