const express = require("express");

const router = express.Router();

router.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Access token required",
    });
  }

  const token = authHeader.substring(7);

  if (!token) {
    return res.status(401).json({
      error: "Access token required",
    });
  }

  return res.status(200).json({
    message: "Access token received",
  });
});

module.exports = router;