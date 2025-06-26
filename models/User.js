const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    adminName: {
      type: String,
      required: [true, "Admin name is required"],
      trim: true,
      minlength: [3, "Admin name must be at least 3 characters long"],
      maxlength: [50, "Admin name cannot exceed 50 characters"],
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
      unique: true,
      trim: true,
      minlength: [3, "User ID must be at least 3 characters long"],
      maxlength: [30, "User ID cannot exceed 30 characters"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      match: [/^[0-9]{10,15}$/, "Please enter a valid phone number"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  return userObject;
};

module.exports = mongoose.model("User-Radhe", userSchema);
