import express from "express";
import connectDB from "./config/database";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import blogRoutes from "./routes/blogPostRoutes";

const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(express.json()); // For parsing application/json

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/blogs', blogRoutes)

export default app;
