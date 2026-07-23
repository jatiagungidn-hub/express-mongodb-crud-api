const express = require("express");
const {
  getUsers,
  getUserById,
  patchUser,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validate");
const { updateUserSchema } = require("../validators/userValidator");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/", getUsers);
router.get("/:id", getUserById);
router.patch("/:id", validate(updateUserSchema), patchUser);
router.delete("/:id", deleteUser);

module.exports = router;
