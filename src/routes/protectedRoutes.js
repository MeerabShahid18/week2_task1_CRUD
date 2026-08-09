const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
  return res.status(200).json({
    id: req.user.id,
    email: req.user.email,
    created_at: req.user.created_at,
  });
});

router.get("/dashboard", authMiddleware, (req, res) => {
  return res.status(200).json({
    message: "Welcome to your protected dashboard",
    user: {
      id: req.user.id,
      email: req.user.email,
    },
  });
});

module.exports = router;