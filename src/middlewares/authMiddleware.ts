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

export const ownerAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    if (userId !== req.decoded?.id)
      return res.status(403).json({ message: "Invalid user" });
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
