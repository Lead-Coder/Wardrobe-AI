const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require('./routes/auth');
const userInfoRoute = require("./routes/userdetail"); 
const Uploadroutes = require("./routes/wardrobe"); 
require('dotenv').config();

const app = express();
app.use(express.json()); 
connectDB();

app.use('/uploads', express.static('uploads'));
app.use(cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token']
  }));
  app.use(express.json());

  // Routes
  app.use('/api/auth', authRoutes);
  app.use("/api/userinfo", userInfoRoute);
  app.use("/api/wardrobe", Uploadroutes);

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
