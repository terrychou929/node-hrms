const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const authenticateToken = require("./utils/utils");
const { User } = require("./models/User");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@mongodb:27017/mevn-cats?authSource=admin`, {
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

// Create User
app.post("/api/users", async (req, res) => {
  try {
    const { email, password, name, department, position } = req.body;

    // Input validation
    if (!email || !password || !name || !department || !position) {
      return res.status(400).json({ 
        error: 'All fields are required' 
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Email already exists' 
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      userId: uuidv4(),
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      department,
      position
    });

    // Save user to database
    await user.save();

    // Return success response (excluding password)
    res.status(201).json({
      message: 'User created successfully',
      user: {
        userId: user.userId,
        email: user.email,
        name: user.name,
        department: user.department,
        position: user.position,
        created_at: user.created_at
      }
    });
  } catch (error) {
    // Handle duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({ 
        error: 'Email already exists' 
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors 
      });
    }

    // Handle other errors
    res.status(500).json({ 
      error: 'Server error',
      message: error.message 
    });
  }
});

// Protected Welcome Route
app.get("/api/welcome", authenticateToken, (req, res) => {
  res.json({ message: `Welcome ${req.user.email}!` });
});


app.listen(3000, () => console.log('Server running on port 3000'));