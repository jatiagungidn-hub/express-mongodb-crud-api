const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({ count: users.length, data: users });
  } catch (err) {
    console.error(err);

    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
