const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const User = require("./models/User");
const authenticateToken = require("./utils/utils");


const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://host.docker.internal:27017/mevn-cats', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('successfully connected to mongodb!'));

// Login Route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      "your_jwt_secret_key",
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { id: user._id, email: user.email, name: user.name }
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Protected Welcome Route
app.get("/api/welcome", authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}!` });
});


app.listen(3000, () => console.log('Server running on port 3000'));