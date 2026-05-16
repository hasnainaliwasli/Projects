const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const { AppError } = require("../middleware/errorHandler");
const { sendResponse } = require("../utils/response");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password) {
    return next(new AppError("Please provide name, email and password", 400));
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new AppError("User already exists", 400));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    const token = generateToken(user._id);
    
    sendResponse(res, 201, "User registered successfully", {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar || "",
      token,
    });
  } else {
    return next(new AppError("Invalid user data", 400));
  }
});

/**
 * @desc    Authenticate a user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return next(new AppError("Please provide an email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new AppError("Invalid credentials", 401));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new AppError("Invalid credentials", 401));
  }

  const token = generateToken(user._id);

  sendResponse(res, 200, "Login successful", {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || "",
    token,
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  sendResponse(res, 200, "User data retrieved", {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || "",
  });
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new AppError("Please provide current and new password", 400));
  }

  if (newPassword.length < 6) {
    return next(new AppError("New password must be at least 6 characters", 400));
  }

  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    return next(new AppError("Current password is incorrect", 401));
  }

  user.password = newPassword;
  await user.save();

  sendResponse(res, 200, "Password updated successfully");
});

/**
 * @desc    Update profile (name and/or avatar)
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res, next) => {
  const updateData = {};

  // Update name if provided
  if (req.body.name) {
    updateData.name = req.body.name;
  }

  // Update avatar if a file is uploaded
  if (req.file) {
    const base64 = req.file.buffer.toString("base64");
    const mimeType = req.file.mimetype;
    updateData.avatar = `data:${mimeType};base64,${base64}`;
  }

  const user = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  sendResponse(res, 200, "Profile updated successfully", {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar || "",
  });
});

module.exports = {
  registerUser,
  loginUser,
  getMe,
  changePassword,
  updateProfile,
};
