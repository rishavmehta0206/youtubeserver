import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

// middleware for erros
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wromg.";
  return res.status(status).json({
    sucess: false,
    status,
    message,
  });
});

app.listen("8800", () => {
  console.log("running");
  connectToDb();
});

const connectToDb = async () => {
  const connection = {};
  try {
    if (connection.isConnected) {
      console.log("Using existing connection");
      return;
    }
    const db = await mongoose.connect(process.env.MONGO_URL);
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};
