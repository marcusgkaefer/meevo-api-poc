import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import { jwtDecode } from "jwt-decode";
dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = ["http://localhost:8080"]; // Add your client origin here

// Use CORS middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // Allow credentials
  })
);

// Parse JSON bodies
app.use(express.json());

// Global variable to store the token
let authToken = null;
let tokenExpiry = null;

const bufferTime = 5 * 60 * 1000; // 5 minutes buffer time before expiry

// Function to obtain JWT from Meevo API
const getJwtToken = async () => {
  try {
    const response = await axios.post(
      process.env.VITE_AUTH_API_BASE_URL,
      {
        client_id: process.env.VITE_CLIENT_ID, // Replace with your appId
        client_secret: process.env.VITE_CLIENT_SECRET, // Replace with your appSecret
      },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    const token = response.data.access_token;
    const decoded = jwtDecode(token);
    tokenExpiry = decoded.exp * 1000; // Convert to milliseconds
    return token;
  } catch (error) {
    console.error(
      "Error obtaining JWT:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

// Middleware to check and refresh token if needed
const checkAuthToken = async (req, res, next) => {
  if (!authToken || Date.now() >= tokenExpiry - bufferTime) {
    try {
      authToken = await getJwtToken();
    } catch (error) {
      console.error(
        "Error refreshing token:",
        error.response ? error.response.data : error.message
      );
      return res.status(500).send("Error refreshing token");
    }
  }
  next();
};

// Proxy endpoint to handle CORS and get token
app.post("/api/token", checkAuthToken, (req, res) => {
  res.json({ token: authToken });
});

// Endpoint to get a list of appointment categories
app.get("/api/appointment-categories", checkAuthToken, async (req, res) => {
  try {
    const response = await axios.get(
      "https://ewcpub.meevoqa.com/publicapi/v1/book/appointmentCategories?TenantId=19&LocationId=27",
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching appointment categories:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Error fetching appointment categories");
  }
});

// Endpoint to get a list of appointment cancellation reasons
app.get(
  "/api/appointment-cancellation-reasons",
  checkAuthToken,
  async (req, res) => {
    try {
      const response = await axios.get(
        "https://ewcpub.meevoqa.com/publicapi/v1/book/appointmentCancellationReasons?TenantId=19&LocationId=27",
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error(
        "Error fetching appointment cancellation reasons:",
        error.response ? error.response.data : error.message
      );
      res.status(500).send("Error fetching appointment cancellation reasons");
    }
  }
);

// New endpoint to get a list of services
app.get("/api/services", checkAuthToken, async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.API_BASE_URL}/services?TenantId=${process.env.VITE_TENANT_ID}&LocationId=${process.env.VITE_LOCATION_ID}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching services:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Error fetching services");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
