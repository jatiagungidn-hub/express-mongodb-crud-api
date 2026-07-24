const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const register = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;

    const newUser = await User.create({
      name,
      username,
      email,
      password,
      role: "user",
    });

    const token = signToken(newUser._id, newUser.role);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      token,
      data: { user: newUser },
    });
  } catch (err) {
    console.error(err);

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
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Please provide both email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return res
        .status(401)
        .json({ status: "error", message: "Incorrect email or password" });
    }

    const token = signToken(user._id, user.role);

    user.password = undefined;
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
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    res.status(200).json({ status: "success", data: user });
  } catch (err) {
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "No fields to update" });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    const { name, username, email, password } = req.body;

    if (name !== undefined) user.name = name;
    if (username !== undefined) user.username = username;
    if (email !== undefined) user.email = email;
    if (password !== undefined) user.password = password;

    const updatedUser = await user.save();

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    console.error(err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ status: "error", message: err.message });
    }

    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid ID format" });
    }

    next(err);
  }
};

module.exports = { register, login, getMe, updateMe };
