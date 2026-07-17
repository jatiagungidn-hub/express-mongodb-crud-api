const express = require("express");
const connectDB = require("./db");
const User = require("./User");

const app = express();
const PORT = 3000;

app.use(express.json());

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

app.get("/users", async (req, res) => {
  try {
    const { name, age, role } = req.query;
    const filters = {};

    if (name) filters.name = { $regex: name, $options: "i" };
    if (age) filters.age = Number(age);
    if (role) filters.role = role.trim().toLowerCase();

    const users = await User.find(filters);

    res.status(200).json({ count: users.length, data: users });
  } catch (err) {
    console.error("GET /users failed: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ data: user });
  } catch (err) {
    console.error("GET /users/:id failed: ", err);

    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format provided" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { name, age, role } = req.body;
    const user = await User.create({ name, age, role });

    console.log("User created: ", user);
    res.status(201).json({ message: "User added successfully", data: user });
  } catch (err) {
    console.error("POST /users failed: ", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }

    // if (err.code === 11000) {
    //   return res
    //     .status(400)
    //     .json({ message: "Unique constraint failed: value already exists." });
    // }

    res.status(500).json({ message: "Internal server error" });
  }
});

app.patch("/users/:id", async (req, res) => {
  try {
    const { name, age, role } = req.body;
    const updatedData = {};

    if (name !== undefined) updatedData.name = name;
    if (age !== undefined) updatedData.age = age;
    if (role !== undefined) updatedData.role = role;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User updated: ", updatedUser);
    res.status(200).json({ message: "User updated", data: updatedUser });
  } catch (err) {
    console.error("PATCH /users/:id failed: ", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format provided" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res
      .status(200)
      .json({ message: "User deleted successfully", data: deletedUser });
  } catch (err) {
    console.error("DELETE /users/:id failed: ", err);
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format provided" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
});

startServer();
