// server/src/routes/github.js
const express = require("express");
const { body, param, query } = require("express-validator");
const axios = require("axios");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const User = require("../models/User");
const { AppError } = require("../middleware/errorHandler");
const logger = require("../utils/logger");

const router = express.Router();

// Helper function to get GitHub API instance with user's access token
const getGithubApi = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "User not found");
  }
  return axios.create({
    baseURL: "https://api.github.com",
    headers: { Authorization: `token ${user.accessToken}` },
  });
};

// Get user's repositories
router.get(
  "/repos",
  [
    auth,
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("per_page")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Per page must be between 1 and 100"),
    validate,
  ],
  async (req, res, next) => {
    try {
      const githubApi = await getGithubApi(req.user.userId);
      const { page = 1, per_page = 30 } = req.query;
      const response = await githubApi.get("/user/repos", {
        params: { page, per_page, sort: "updated" },
      });
      res.json(response.data);
    } catch (error) {
      logger.error("Error fetching repositories:", error);
      next(new AppError(500, "Failed to fetch repositories"));
    }
  }
);

// Get a specific repository
router.get(
  "/repos/:owner/:repo",
  [
    auth,
    param("owner").notEmpty().withMessage("Owner is required"),
    param("repo").notEmpty().withMessage("Repository name is required"),
    validate,
  ],
  async (req, res, next) => {
    try {
      const { owner, repo } = req.params;
      const githubApi = await getGithubApi(req.user.userId);
      const response = await githubApi.get(`/repos/${owner}/${repo}`);
      res.json(response.data);
    } catch (error) {
      logger.error("Error fetching repository:", error);
      next(new AppError(500, "Failed to fetch repository"));
    }
  }
);

// Get issues for a specific repository
router.get(
  "/repos/:owner/:repo/issues",
  [
    auth,
    param("owner").notEmpty().withMessage("Owner is required"),
    param("repo").notEmpty().withMessage("Repository name is required"),
    query("state")
      .optional()
      .isIn(["open", "closed", "all"])
      .withMessage("Invalid state"),
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("per_page")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Per page must be between 1 and 100"),
    validate,
  ],
  async (req, res, next) => {
    try {
      const { owner, repo } = req.params;
      const { state = "open", page = 1, per_page = 30 } = req.query;
      const githubApi = await getGithubApi(req.user.userId);
      const response = await githubApi.get(`/repos/${owner}/${repo}/issues`, {
        params: { state, page, per_page },
      });
      res.json(response.data);
    } catch (error) {
      logger.error("Error fetching issues:", error);
      next(new AppError(500, "Failed to fetch issues"));
    }
  }
);

// Get pull requests for a specific repository
router.get(
  "/repos/:owner/:repo/pulls",
  [
    auth,
    param("owner").notEmpty().withMessage("Owner is required"),
    param("repo").notEmpty().withMessage("Repository name is required"),
    query("state")
      .optional()
      .isIn(["open", "closed", "all"])
      .withMessage("Invalid state"),
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("per_page")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Per page must be between 1 and 100"),
    validate,
  ],
  async (req, res, next) => {
    try {
      const { owner, repo } = req.params;
      const { state = "open", page = 1, per_page = 30 } = req.query;
      const githubApi = await getGithubApi(req.user.userId);
      const response = await githubApi.get(`/repos/${owner}/${repo}/pulls`, {
        params: { state, page, per_page },
      });
      res.json(response.data);
    } catch (error) {
      logger.error("Error fetching pull requests:", error);
      next(new AppError(500, "Failed to fetch pull requests"));
    }
  }
);

// Create a new issue in a repository
router.post(
  "/repos/:owner/:repo/issues",
  [
    auth,
    param("owner").notEmpty().withMessage("Owner is required"),
    param("repo").notEmpty().withMessage("Repository name is required"),
    body("title").notEmpty().withMessage("Issue title is required"),
    body("body").notEmpty().withMessage("Issue body is required"),
    validate,
  ],
  async (req, res, next) => {
    try {
      const { owner, repo } = req.params;
      const { title, body } = req.body;
      const githubApi = await getGithubApi(req.user.userId);
      const response = await githubApi.post(`/repos/${owner}/${repo}/issues`, {
        title,
        body,
      });
      res.status(201).json(response.data);
    } catch (error) {
      logger.error("Error creating issue:", error);
      next(new AppError(500, "Failed to create issue"));
    }
  }
);

// Create a new pull request in a repository
router.post(
  "/repos/:owner/:repo/pulls",
  [
    auth,
    param("owner").notEmpty().withMessage("Owner is required"),
    param("repo").notEmpty().withMessage("Repository name is required"),
    body("title").notEmpty().withMessage("Pull request title is required"),
    body("body").notEmpty().withMessage("Pull request body is required"),
    body("head").notEmpty().withMessage("Head branch is required"),
    body("base").notEmpty().withMessage("Base branch is required"),
    validate,
  ],
  async (req, res, next) => {
    try {
      const { owner, repo } = req.params;
      const { title, body, head, base } = req.body;
      const githubApi = await getGithubApi(req.user.userId);
      const response = await githubApi.post(`/repos/${owner}/${repo}/pulls`, {
        title,
        body,
        head,
        base,
      });
      res.status(201).json(response.data);
    } catch (error) {
      logger.error("Error creating pull request:", error);
      next(new AppError(500, "Failed to create pull request"));
    }
  }
);

// Get commits for a specific repository
router.get(
  "/repos/:owner/:repo/commits",
  [
    auth,
    param("owner").notEmpty().withMessage("Owner is required"),
    param("repo").notEmpty().withMessage("Repository name is required"),
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("per_page")
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage("Per page must be between 1 and 100"),
    validate,
  ],
  async (req, res, next) => {
    try {
      const { owner, repo } = req.params;
      const { page = 1, per_page = 30 } = req.query;
      const githubApi = await getGithubApi(req.user.userId);
      const response = await githubApi.get(`/repos/${owner}/${repo}/commits`, {
        params: { page, per_page },
      });
      res.json(response.data);
    } catch (error) {
      logger.error("Error fetching commits:", error);
      next(new AppError(500, "Failed to fetch commits"));
    }
  }
);

module.exports = router;
