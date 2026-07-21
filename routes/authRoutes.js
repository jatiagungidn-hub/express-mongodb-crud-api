const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { name, username, email, password, role } = req.body;

    const user = await User.create({ name, username, email, password, role });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: user,
    });
  } catch (err) {
    cosole.error(err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ status: "error", message: err.message });
    }
    if (err.code === 11000) {
      return res.status(400).json({
        status: "error",
        message: "Duplicate Key Error: Data already exists",
      });
    }

    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide both email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ status: "error", message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "fallback_super_secret_key",
      { expiresIn: "1d" },
    );

    res.status(200).json({
      status: "success",
      message: "Login successfully",
      token,
      data: user,
    });
  } catch (err) {
    console.error(err);

    next(err);
  }
});

module.exports = router;
