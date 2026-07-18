const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { name, age, role } = req.query;
    const filters = {};

    if (Number.isNaN(age)) {
      return res.status(400).json({ message: "Age must be a number." });
    }

    if (name) filters.name = { $regex: name, $options: "i" };
    if (age) filters.age = Number(age);
    if (role) filters.role = role.trim().toLowerCase();

    const users = await User.find(filters);

    res.status(200).json({
      message:
        users.length > 0
          ? `Find ${users.length} match user(s)`
          : "No user matched your query.",
      count: users.length,
      data: users,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);

    res.status(200).json({ count: user.length, data: user });
  } catch (err) {
    console.error(err);

    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { name, age, role } = req.body;
    const updates = {};

    if (name !== undefined) updates.name = name;
    if (age !== undefined) updates.age = age;
    if (role !== undefined) updates.role = role;
    if (!updates) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { updates },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    console.log(updatedUser);
    res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (err) {
    console.error(err);

    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID" });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
