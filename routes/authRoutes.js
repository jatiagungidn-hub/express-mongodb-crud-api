const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const {
  registerSchema,
  loginSchema,
  updateUserSchema,
} = require("../validators/userValidator");
const {
  register,
  login,
  getMe,
  updateMe,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", protect, getMe);
router.patch("/me", protect, validate(updateUserSchema), updateMe);

module.exports = router;
