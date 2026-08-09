const express = require("express");
const supabase = require("../config/supabase");

const router = express.Router();

router.get("/profile", async (req, res) => {
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

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }

  return res.status(200).json({
    id: data.user.id,
    email: data.user.email,
    created_at: data.user.created_at,
  });
});

module.exports = router;