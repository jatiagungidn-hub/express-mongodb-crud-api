const express = require("express");
const User = require("./User");
const connectDB = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`App running on http://localhost:${PORT}`);
  });
}

app.get("/users", async (req, res) => {
  try {
    const { name, age, role } = req.query;
    let filteredUser = {};

    if (name) filteredUser.name = { $regex: name, $options: "i" };
    if (age) filteredUser.age = Number(age);
    if (role) filteredUser.role = role;

    const users = await User.find(filteredUser);

    res.status(200).json({ count: users.length, data: users });
  } catch (err) {
    console.error(err);
    if (err.name === "ReferenceError") {
      res.json({ message: err.message });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

startServer();
