// server/src/routes/auth.js
const express = require("express");
const axios = require("axios");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/github", async (req, res) => {
  const { code } = req.body;

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const { access_token } = tokenResponse.data;

    // Fetch user data from GitHub
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${access_token}` },
    });

    const { id, login, avatar_url } = userResponse.data;

    // Find or create user in our database
    let user = await User.findOne({ githubId: id });
    if (!user) {
      user = new User({
        githubId: id,
        username: login,
        avatarUrl: avatar_url,
      });
      await user.save();
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("GitHub authentication error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
});

module.exports = router;
