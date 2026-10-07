import Certification from "../models/Certification.js";

// GET /api/certifications
export const getMyCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find({ user: req.user._id }).sort({
      issueDate: -1,
      createdAt: -1,
    });
    res.json({ certifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/certifications
export const addCertification = async (req, res) => {
  try {
    const { name, issuer, issueDate, credentialUrl } = req.body;

    const certification = await Certification.create({
      user: req.user._id,
      name,
      issuer,
      issueDate: issueDate || null,
      credentialUrl,
    });

    res.status(201).json({ certification });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/certifications/:id
export const deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!certification) {
      return res.status(404).json({ message: "Certification not found" });
    }

    res.json({ message: "Certification deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};