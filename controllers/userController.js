const User = require("../models/User");

const getUsers = async (req, res, next) => {
  try {
    const { name, username, email, role } = req.query;
    const filters = {};

    if (name) filters.name = { $regex: name, $options: "i" };
    if (username) filters.username = { $regex: username, $options: "i" };
    if (role) filters.role = role.trim().toLowerCase();

    const users = await User.find(filters).select("-password");

    res.status(200).json({
      status: "success",
      message:
        users.length > 0
          ? `Found ${users.length} matching user(s)`
          : "No user matched your query.",
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found." });
    }

    res.status(200).json({ status: "success", data: user });
  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid ID format" });
    }

    next(err);
  }
};

const patchUser = async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "No fields to update" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found." });
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

const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found." });
    }

    res
      .status(200)
      .json({ status: "success", message: "User successfully deleted" });
  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res.status(400).json({ status: "error", message: "Invalid ID" });
    }

    next(err);
  }
};

module.exports = { getUsers, getUserById, patchUser, deleteUser };
