const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const sampleUsers = [
  {
    adminName: "John Doe",
    userId: "john123",
    phoneNumber: "1234567890",
  },
  {
    adminName: "Admin User",
    userId: "admin001",
    phoneNumber: "9998887777",
  },
  {
    adminName: "Aditya",
    userId: "1191752740",
    phoneNumber: "9950866260",
  },
  {
    adminName: "Pulkit Arora",
    userId: "1292422419",
    phoneNumber: "8847412522",
  },
];

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Drop the 'users' collection to ensure a clean slate, including old indexes
    try {
      await mongoose.connection.db.dropCollection("users");
      console.log("🗑️ Dropped 'users' collection");
    } catch (error) {
      if (error.code === 26) {
        // 26 is the error code for "collection not found"
        console.log("ℹ️ 'users' collection not found, skipping drop.");
      } else {
        console.error("❌ Error dropping 'users' collection:", error);
        process.exit(1);
      }
    }

    // Clear existing users (optional - remove this if you want to keep existing users)
    await User.deleteMany({});
    console.log("🗑️ Cleared existing users");

    // Create sample users
    const createdUsers = [];

    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(
        `✅ Created user: ${user.adminName} (User ID: ${user.userId}, Phone: ${user.phoneNumber})`
      );
    }

    console.log("\n🎉 Sample users created successfully!");
    console.log("\n📋 Login credentials:");
    console.log("Regular User:");
    console.log("  Admin Name: John Doe");
    console.log("  User ID: john123");
    console.log("  Phone Number: 1234567890");
    console.log("\nAdmin User:");
    console.log("  Admin Name: Admin User");
    console.log("  User ID: admin001");
    console.log("  Phone Number: 9998887777");
    console.log("\nNew User 1:");
    console.log("  Admin Name: Aditya");
    console.log("  User ID: 1191752740");
    console.log("  Phone Number: 9950866260");
    console.log("\nNew User 2:");
    console.log("  Admin Name: Pulkit Arora");
    console.log("  User ID: 1292422419");
    console.log("  Phone Number: 8847412522");

    // Close connection
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    process.exit(1);
  }
};

// Run seeder if this file is executed directly
if (require.main === module) {
  seedUsers();
}

module.exports = { seedUsers, sampleUsers };
