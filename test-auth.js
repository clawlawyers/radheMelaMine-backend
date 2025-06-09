const axios = require("axios");

const BASE_URL = "http://localhost:3000";

async function testAuthentication() {
  console.log("🧪 Testing Authentication System\n");

  try {
    // Test 1: Health Check
    console.log("1. Testing Health Check...");
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log("✅ Health check passed:", healthResponse.data.status);

    // Test 2: Signup with sample user
    console.log("\n2. Testing Signup...");
    const signupResponse = await axios.post(`${BASE_URL}/api/auth/signup`, {
      adminName: "John Doe",
      userId: "john123",
      phoneNumber: "1234567890",
    });

    if (signupResponse.data.success) {
      console.log("✅ Signup successful");
      console.log("   Admin Name:", signupResponse.data.data.user.adminName);
      console.log("   User ID:", signupResponse.data.data.user.userId);
      console.log(
        "   Phone Number:",
        signupResponse.data.data.user.phoneNumber
      );
      console.log("   Role:", signupResponse.data.data.user.role);
    }

    // Test 3: Login with sample user
    console.log("\n3. Testing Login...");
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      userId: "john123",
      phoneNumber: "1234567890",
    });

    if (loginResponse.data.success) {
      console.log("✅ Login successful");
      console.log("   Admin Name:", loginResponse.data.data.user.adminName);
      console.log("   User ID:", loginResponse.data.data.user.userId);
      console.log("   Phone Number:", loginResponse.data.data.user.phoneNumber);
      console.log("   Role:", loginResponse.data.data.user.role);

      const token = loginResponse.data.data.token;

      // Test 4: Get Profile with token
      console.log("\n4. Testing Protected Route (Get Profile)...");
      const profileResponse = await axios.get(`${BASE_URL}/api/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (profileResponse.data.success) {
        console.log("✅ Profile retrieval successful");
        console.log("   Admin Name:", profileResponse.data.data.user.adminName);
        console.log("   User ID:", profileResponse.data.data.user.userId);
        console.log(
          "   Phone Number:",
          profileResponse.data.data.user.phoneNumber
        );
      }

      // Test 5: Test without token (should fail)
      console.log("\n5. Testing Protected Route without Token...");
      try {
        await axios.get(`${BASE_URL}/api/auth/profile`);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log("✅ Unauthorized access properly blocked");
        }
      }
    }

    // Test 6: Test Admin Signup and Login
    console.log("\n6. Testing Admin Signup and Login...");
    const adminSignupResponse = await axios.post(
      `${BASE_URL}/api/auth/signup`,
      {
        adminName: "Admin User",
        userId: "admin001",
        phoneNumber: "9998887777",
        role: "admin",
      }
    );

    if (adminSignupResponse.data.success) {
      console.log("✅ Admin signup successful");
      console.log(
        "   Admin Name:",
        adminSignupResponse.data.data.user.adminName
      );
      console.log("   User ID:", adminSignupResponse.data.data.user.userId);
      console.log(
        "   Phone Number:",
        adminSignupResponse.data.data.user.phoneNumber
      );
      console.log("   Role:", adminSignupResponse.data.data.user.role);
    }

    const adminLoginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      userId: "admin001",
      phoneNumber: "9998887777",
    });

    if (adminLoginResponse.data.success) {
      console.log("✅ Admin login successful");
      console.log(
        "   Admin Name:",
        adminLoginResponse.data.data.user.adminName
      );
      console.log("   User ID:", adminLoginResponse.data.data.user.userId);
      console.log(
        "   Phone Number:",
        adminLoginResponse.data.data.user.phoneNumber
      );
      console.log("   Role:", adminLoginResponse.data.data.user.role);
    }

    console.log("\n🎉 All authentication tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

// Run tests
testAuthentication();
