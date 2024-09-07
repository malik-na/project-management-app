// server/src/controllers/projectController.js

const Project = require("../models/Project");
const { AppError } = require("../utils/errorHandler");

exports.createProject = async (req, res, next) => {
  try {
    const project = new Project({
      ...req.body,
      owner: req.user.id,
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    next(new AppError(400, "Error creating project"));
  }
};

exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    });
    res.json(projects);
  } catch (error) {
    next(new AppError(400, "Error fetching projects"));
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    });
    if (!project) {
      return next(new AppError(404, "Project not found"));
    }
    res.json(project);
  } catch (error) {
    next(new AppError(400, "Error fetching project"));
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!project) {
      return next(
        new AppError(404, "Project not found or you're not the owner")
      );
    }
    res.json(project);
  } catch (error) {
    next(new AppError(400, "Error updating project"));
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });
    if (!project) {
      return next(
        new AppError(404, "Project not found or you're not the owner")
      );
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    next(new AppError(400, "Error deleting project"));
  }
};

exports.addProjectMember = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { $addToSet: { members: req.body.userId } },
      { new: true }
    );
    if (!project) {
      return next(
        new AppError(404, "Project not found or you're not the owner")
      );
    }
    res.json(project);
  } catch (error) {
    next(new AppError(400, "Error adding project member"));
  }
};

exports.removeProjectMember = async (req, res, next) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { $pull: { members: req.params.userId } },
      { new: true }
    );
    if (!project) {
      return next(
        new AppError(404, "Project not found or you're not the owner")
      );
    }
    res.json(project);
  } catch (error) {
    next(new AppError(400, "Error removing project member"));
  }
};

exports.getProjectStats = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      $or: [{ owner: req.user.id }, { members: req.user.id }],
    });
    if (!project) {
      return next(new AppError(404, "Project not found"));
    }
    // Implement project statistics logic here
    res.json({ message: "Project statistics functionality to be implemented" });
  } catch (error) {
    next(new AppError(400, "Error fetching project statistics"));
  }
};
