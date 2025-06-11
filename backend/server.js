import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postsRoutes from './routes/posts.routes.js';
import usersRoutes from './routes/user.routes.js';

// Load environment variables from .env
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

// Routes
app.use(postsRoutes);
app.use(usersRoutes);

// Start server and connect to DB
const start = async () => {
  try {
   await mongoose.connect(process.env.MONGODB_URI);

    const PORT = process.env.PORT || 8011;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
  }
};

start();
