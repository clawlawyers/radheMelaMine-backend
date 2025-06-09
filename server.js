const express = require("express");
const axios = require("axios");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

// Import database connection and routes
const connectDB = require("./config/database");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || "http://74.225.190.5:8000";

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for handling form data
const upload = multer();

// Helper function to forward requests to FastAPI backend
async function forwardRequest(req, res, method, endpoint) {
  try {
    const config = {
      method: method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json",
      },
    };

    // Add data for POST requests
    if (method === "POST" && req.body) {
      if (
        req.headers["content-type"]?.includes(
          "application/x-www-form-urlencoded"
        )
      ) {
        config.data = new URLSearchParams(req.body).toString();
        config.headers["Content-Type"] = "application/x-www-form-urlencoded";
      } else {
        config.data = req.body;
      }
    }

    // Add query parameters for GET requests
    if (method === "GET" && req.query) {
      config.params = req.query;
    }

    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(`Error forwarding ${method} ${endpoint}:`, error.message);
    if (error.response) {
      res.status(error.response.status).json({
        error: error.response.data || "Error from backend server",
      });
    } else {
      res.status(500).json({
        error: "Failed to connect to backend server",
      });
    }
  }
}

// Routes

// Authentication routes
app.use("/api/auth", authRoutes);

// GET / - Read Root
app.get("/", async (req, res) => {
  await forwardRequest(req, res, "GET", "/");
});

// POST /update_order_status - Update Order Status
app.post("/update_order_status", upload.none(), async (req, res) => {
  await forwardRequest(req, res, "POST", "/update_order_status");
});

// POST /submit_feedback - Submit Feedback
app.post("/submit_feedback", upload.none(), async (req, res) => {
  await forwardRequest(req, res, "POST", "/submit_feedback");
});

// GET /list_csv_links - List CSV Links
app.get("/list_csv_links", async (req, res) => {
  await forwardRequest(req, res, "GET", "/list_csv_links");
});

// POST /update_csv_file - Update CSV File
app.post("/update_csv_file", upload.none(), async (req, res) => {
  await forwardRequest(req, res, "POST", "/update_csv_file");
});

// GET /get_order_details - Get Order Details
app.get("/get_order_details", async (req, res) => {
  await forwardRequest(req, res, "GET", "/get_order_details");
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Node.js proxy server is running",
    backend_url: BASE_URL,
    timestamp: new Date().toISOString(),
  });
});

// Catch-all route for undefined endpoints
app.all("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    available_routes: [
      "GET /",
      "POST /update_order_status",
      "POST /submit_feedback",
      "GET /list_csv_links",
      "POST /update_csv_file",
      "GET /get_order_details",
      "GET /health",
      "POST /api/auth/signup",
      "POST /api/auth/login",
      "GET /api/auth/profile (requires auth)",
      "PUT /api/auth/profile (requires auth)",
      "PUT /api/auth/change-password (requires auth)",
    ],
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({
    error: "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Node.js proxy server is running on port ${PORT}`);
  console.log(`📡 Forwarding requests to: ${BASE_URL}`);
  console.log(`🔗 Available routes:`);
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   POST http://localhost:${PORT}/update_order_status`);
  console.log(`   POST http://localhost:${PORT}/submit_feedback`);
  console.log(`   GET  http://localhost:${PORT}/list_csv_links`);
  console.log(`   POST http://localhost:${PORT}/update_csv_file`);
  console.log(`   GET  http://localhost:${PORT}/get_order_details`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`\n🔐 Authentication routes:`);
  console.log(`   POST http://localhost:${PORT}/api/auth/signup`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  console.log(
    `   GET  http://localhost:${PORT}/api/auth/profile (requires auth)`
  );
  console.log(
    `   PUT  http://localhost:${PORT}/api/auth/profile (requires auth)`
  );
  console.log(
    `   PUT  http://localhost:${PORT}/api/auth/change-password (requires auth)`
  );
});

module.exports = app;
