import { Request, Response } from "express";
import dotenv from 'dotenv';
dotenv.config();
import app from "@/app";

const PORT = process.env.PORT || 3000; console.log('node_env: ', process.env.NODE_ENV);

// Basic route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript with Express!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
