const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register new user
const signup = async (req, res) => {
  try {
    const { adminName, userId, phoneNumber, role } = req.body;

    // Validate required fields
    if (!adminName || !userId || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Admin name, user ID, and phone number are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ userId }, { phoneNumber }],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this user ID or phone number already exists",
      });
    }

    // Create new user
    const userData = {
      adminName,
      userId,
      phoneNumber,
    };

    // Only allow admin role if explicitly set (for seeding purposes)
    if (role === "admin") {
      userData.role = "admin";
    }

    const user = new User(userData);
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { userId, phoneNumber } = req.body;

    // Validate required fields
    if (!userId || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "User ID and phone number are required",
      });
    }

    // Find user by userId and phoneNumber
    const user = await User.findOne({ userId, phoneNumber });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid user ID or phone number",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is deactivated",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Profile retrieved successfully",
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { adminName, userId, phoneNumber } = req.body;
    const currentUserId = req.user._id;

    // Check if userId or phoneNumber already exists (excluding current user)
    if (userId || phoneNumber) {
      const query = {
        _id: { $ne: currentUserId },
        $or: [],
      };

      if (userId) query.$or.push({ userId });
      if (phoneNumber) query.$or.push({ phoneNumber });

      if (query.$or.length > 0) {
        const existingUser = await User.findOne(query);

        if (existingUser) {
          return res.status(409).json({
            success: false,
            message: "User ID or phone number already exists",
          });
        }
      }
    }

    // Update user
    const updateData = {};
    if (adminName) updateData.adminName = adminName;
    if (userId) updateData.userId = userId;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;

    const user = await User.findByIdAndUpdate(currentUserId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/*
 * Password change functionality is disabled as password is no longer used.
 */

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile,
};
