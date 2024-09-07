// server/src/routes/projects.js

const express = require("express");
const { body, param, query } = require("express-validator");
const authMiddleware = require("../middleware/auth");
const { validateRequest } = require("../middleware/validate");
const projectController = require("../controllers/projectController");

const router = express.Router();

// Create a new project
router.post(
  "/",
  [
    authMiddleware,
    body("name").notEmpty().withMessage("Project name is required"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("githubRepo")
      .optional()
      .isURL()
      .withMessage("Invalid GitHub repository URL"),
    body("status")
      .optional()
      .isIn(["planning", "active", "completed"])
      .withMessage("Invalid project status"),
    validateRequest,
  ],
  projectController.createProject
);

// Get all projects
router.get("/", authMiddleware, projectController.getAllProjects);

// Get a specific project
router.get(
  "/:id",
  [
    authMiddleware,
    param("id").isMongoId().withMessage("Invalid project ID"),
    validateRequest,
  ],
  projectController.getProjectById
);

// Update a project
router.put(
  "/:id",
  [
    authMiddleware,
    param("id").isMongoId().withMessage("Invalid project ID"),
    body("name")
      .optional()
      .notEmpty()
      .withMessage("Project name cannot be empty"),
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),
    body("githubRepo")
      .optional()
      .isURL()
      .withMessage("Invalid GitHub repository URL"),
    body("status")
      .optional()
      .isIn(["planning", "active", "completed"])
      .withMessage("Invalid project status"),
    validateRequest,
  ],
  projectController.updateProject
);

// Delete a project
router.delete(
  "/:id",
  [
    authMiddleware,
    param("id").isMongoId().withMessage("Invalid project ID"),
    validateRequest,
  ],
  projectController.deleteProject
);

// Add a member to a project
router.post(
  "/:id/members",
  [
    authMiddleware,
    param("id").isMongoId().withMessage("Invalid project ID"),
    body("userId").isMongoId().withMessage("Invalid user ID"),
    validateRequest,
  ],
  projectController.addProjectMember
);

// Remove a member from a project
router.delete(
  "/:id/members/:userId",
  [
    authMiddleware,
    param("id").isMongoId().withMessage("Invalid project ID"),
    param("userId").isMongoId().withMessage("Invalid user ID"),
    validateRequest,
  ],
  projectController.removeProjectMember
);

// Get project statistics
router.get(
  "/:id/stats",
  [
    authMiddleware,
    param("id").isMongoId().withMessage("Invalid project ID"),
    validateRequest,
  ],
  projectController.getProjectStats
);

module.exports = router;
