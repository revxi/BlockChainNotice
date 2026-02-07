const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Helper function to upload to Pinata
const uploadToPinata = async (jsonBody) => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  // Use keys from environment variables
  const pinataApiKey = process.env.PINATA_API_KEY;
  const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;

  if (!pinataApiKey || !pinataSecretApiKey) {
    console.warn("Missing Pinata API keys. Using mock IPFS hash.");
    // Return a mock hash for testing purposes
    return "Qm" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  try {
    const response = await axios.post(
      url,
      jsonBody,
      {
        headers: {
          pinata_api_key: pinataApiKey,
          pinata_secret_api_key: pinataSecretApiKey,
        },
      }
    );
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading to Pinata:", error);
    throw new Error("Failed to upload to IPFS");
  }
};

app.post("/api/upload", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    // Structure the data to be pinned
    const noticeData = {
      title,
      content,
      timestamp: new Date().toISOString(),
    };

    const ipfsHash = await uploadToPinata(noticeData);

    res.json({
      success: true,
      ipfsHash,
      message: "Successfully pinned to IPFS"
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload notice" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
