const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { name, age, role } = req.body;
    const user = await User.create({ name, age, role });

    res.status(201).json({
      status: "success",
      message: "User added successfully",
      data: user,
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
});

router.get("/", async (req, res, next) => {
  try {
    const { name, age, role } = req.query;
    const filters = {};

    if (age !== undefined && isNaN(Number(age))) {
      return res
        .status(400)
        .json({ status: "error", message: "Age must be a number." });
    }

    if (name) filters.name = { $regex: name, $options: "i" };
    if (age) filters.age = Number(age);
    if (role) filters.role = role.trim().toLowerCase();

    const users = await User.find(filters);

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
});

router.get("/:id", async (req, res, next) => {
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
});

router.patch("/:id", async (req, res, next) => {
  try {
    const { name, age, role } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (age !== undefined) updates.age = Number(age);
    if (role !== undefined) updates.role = role;
    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ status: "error", message: "No fields to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found." });
    }

    console.log(updatedUser);
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
});

router.delete("/:id", async (req, res, next) => {
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
});

module.exports = router;
