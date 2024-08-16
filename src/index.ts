import { Request, Response } from "express";
import dotenv from 'dotenv';
dotenv.config();
import app from "@/app";

const PORT = process.env.PORT || 3000;

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
