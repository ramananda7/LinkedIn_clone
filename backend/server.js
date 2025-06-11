import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import postsRoutes from "./routes/posts.routes.js";
import usersRoutes from "./routes/user.routes.js";

dotenv.config();
const app =express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("uploads"));
app.use(postsRoutes);
app.use(usersRoutes);

const start = async()=>{
    const connectDB = await mongoose.connect('mongodb://localhost:27017/mydatabase');
    app.listen(8011,()=>{
        console.log("server is running");
    });
}

start(); 