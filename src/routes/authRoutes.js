const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const {
  signup,
  login,
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authMiddleware, async (req, res) => {
  const { error } = await supabase.auth.signOut(req.accessToken);

  if (error) {
    return res.status(500).json({
      error: "Logout failed",
    });
  }

  return res.status(204).send();
});

module.exports = router;