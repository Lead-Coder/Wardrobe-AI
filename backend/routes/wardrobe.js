const express = require('express');
const multer = require('multer');
const WardrobeItem = require('../models/upload');
const path = require('path');
const router = express.Router();

// Sanitize email/username for filenames
const sanitizeEmail = (email) => email.replace(/[^a-zA-Z0-9]/g, "_");

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const username = sanitizeEmail(req.body.username || 'user');
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1E6)}`;
    const filename = `${username}_${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB
  }
});

// Upload endpoint
router.post('/upload', upload.array('images'), async (req, res) => {
  try {
    const username = req.body.username;
    if (!username) return res.status(400).json({ message: "Username is required" });

    if (!req.body.metadataList) {
      return res.status(400).json({ message: "metadataList is missing" });
    }

    let parsedMetadata;
    try {
      parsedMetadata = JSON.parse(req.body.metadataList);
      if (!Array.isArray(parsedMetadata)) {
        parsedMetadata = [parsedMetadata]; // normalize single entry
      }
    } catch (err) {
      console.error("Metadata JSON parse error:", err);
      return res.status(400).json({ message: "Invalid metadataList format" });
    }

    if (parsedMetadata.length !== req.files.length) {
      return res.status(400).json({ message: "Number of metadata entries must match number of uploaded images" });
    }

    const savedItems = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const metadata = parsedMetadata[i] || {};

      const wardrobeItem = new WardrobeItem({
        imageUrl: `/uploads/${file.filename}`,
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        ...metadata,
        username: username,
        uploadDate: new Date()
      });

      const savedItem = await wardrobeItem.save();
      savedItems.push(savedItem);
    }
    console.log("asdbi")
    res.status(200).json({ message: "Upload successful", data: savedItems });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});

module.exports = router;
