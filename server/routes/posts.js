const express = require("express");
const Post = require("../models/Post");
const User = require("../models/User");
const { verifyFirebaseToken } = require("../middleware/auth");
const router = express.Router();

// Get user's posts
router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const posts = await Post.find({ authorUid: req.user.uid }).sort({
      createdAt: -1,
    });

    res.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Create new post
router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    const user = await User.findOne({ uid: req.user.uid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const post = new Post({
      content: content.trim(),
      author: user._id,
      authorUid: req.user.uid,
    });

    await post.save();
    res.status(201).json({ post });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

module.exports = router;
