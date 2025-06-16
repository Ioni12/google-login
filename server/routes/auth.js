const express = require("express");
const User = require("../models/User");
const { verifyFirebaseToken } = require("../middleware/auth");
const router = express.Router();

// Save user to MongoDB after Firebase auth
router.post("/save-user", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;

    let user = await User.findOne({ uid });

    if (user) {
      // Update existing user
      user.lastLogin = new Date();
      user.displayName = displayName;
      user.photoURL = photoURL;
      await user.save();
    } else {
      // Create new user
      user = new User({
        uid,
        email,
        displayName,
        photoURL,
      });
      await user.save();
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Failed to save user" });
  }
});

module.exports = router;
