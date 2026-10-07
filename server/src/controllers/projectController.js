import Project from "../models/Project.js";

// GET /api/projects
export const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id })
      .populate("techStack")
      .sort({ createdAt: -1 });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/projects
export const createProject = async (req, res) => {
  try {
    const { title, description, techStack, githubUrl, liveUrl, status } = req.body;

    const project = await Project.create({
      user: req.user._id,
      title,
      description,
      techStack: techStack || [],
      githubUrl,
      liveUrl,
      status,
    });

    await project.populate("techStack");
    res.status(201).json({ project });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/projects/:id
export const updateProject = async (req, res) => {
  try {
    const allowed = ["title", "description", "techStack", "githubUrl", "liveUrl", "status"];
    const updates = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: updates },
      { returnDocument: "after", runValidators: true }
    ).populate("techStack");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ project });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({ message: "Project deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};