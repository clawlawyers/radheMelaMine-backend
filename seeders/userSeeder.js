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
    role: "user",
  },
  {
    adminName: "Admin User",
    userId: "admin001",
    phoneNumber: "9998887777",
    role: "admin",
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
        `✅ Created user: ${user.adminName} (User ID: ${user.userId}, Phone: ${user.phoneNumber}, Role: ${user.role})`
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
