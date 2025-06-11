import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postsRoutes from "./routes/posts.routes.js";
import usersRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));

app.use(postsRoutes);
app.use(usersRoutes);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    app.listen(8011, () => {
      console.log("Server is running on port 8011");
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
  }
};

start();
