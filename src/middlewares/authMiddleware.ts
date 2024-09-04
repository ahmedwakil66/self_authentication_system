import { Request, Response, NextFunction } from "express";
import jwt from "../config/jwt";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verifyToken(token, "access");
    if (!decoded) return res.status(403).json({ message: "Invalid token" });

    req.decoded = decoded;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const authMiddlewareSafe = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) throw new Error("no token, will use safe mode");

    try {
      const decoded = jwt.verifyToken(token, "access");
      if (!decoded) return res.status(403).json({ message: "Invalid token" });

      req.decoded = decoded;
      next();
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  } catch (error) {
    req.decoded = undefined;
    next();
  }
};
