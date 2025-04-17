const express = require("express");
const multer = require("multer");
const fs = require('fs');
const path = require('path');
const router = express.Router();
const User = require("../models/userdetail");

const sanitizeEmail = (email) => {
  return email.replace(/[^a-zA-Z0-9]/g, "_"); 
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const email = req.body.email || "unknown_user";
    const folderName = sanitizeEmail(email);
    const uploadPath = path.join(__dirname, "uploads", folderName);
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext);
    cb(null, `${baseName}_${timestamp}${ext}`);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      email,
      age,
      height,
      size,
      gender,
      preferences,
      color,
      material,
      fitting,
      region,
    } = req.body;

    const newUser = new User({
      email,
      age,
      height,
      size,
      gender,
      preferences,
      color,
      material,
      fitting,
      region,
      image: req.file ? req.file.filename : null, // Save filename if image is uploaded
    });

    await newUser.save();
    res.status(201).json({ message: "User info saved successfully" });
  } catch (err) {
    console.error("Error saving user info:", err.message);
    res.status(500).json({ message: "Failed to save user info" });
  }
});

module.exports = router;
