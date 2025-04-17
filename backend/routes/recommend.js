const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../models/userdetail");
const Wardrobe = require("../models/Wardrobe");

router.post("/recommend", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    const wardrobeItems = await Wardrobe.find({ userEmail: email });
    if (!user || wardrobeItems.length === 0) {
      return res.status(404).json({ message: "User or wardrobe data not found" });
    }

    const payload = {
      userdetails: {
        email: user.email,
        preferences: user.preferences,
      },
      wardrobe: wardrobeItems.map(item => ({
        color: item.color,
        category: item.category,
        image: item.imageURL,
      })),
    };

    const flaskRes = await axios.post("http://localhost:5000/recommendations", payload);

    res.status(200).json(flaskRes.data); 
  } catch (error) {
    console.error("Error in recommend route:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
