const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { prisma } = require("../config/db");

// @desc    Register new User
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please add all fields");
  }

  const userExists = await prisma.user.findFirst({
    where: { email },
  });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create a user
  const user = await prisma.user.create({
    data: {
      id: uuidv4(),
      email,
      name,
      password: hashedPassword,
    },
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Authenticate new User
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }

  if (await bcrypt.compare(password, user.password)) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  const { id, name, email } = await prisma.user.findFirst({
    where: { id: req.user.id },
  });

  res.status(200).json({ id, name, email });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "10h",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
