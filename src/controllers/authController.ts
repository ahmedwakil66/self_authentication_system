import { Request, Response } from "express";
import jwt from "@/config/jwt";
import User from "@/models/userModel";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json("Invalid credentials");
    }

    // Validate password
    const matched = await user.comparePassword(password);
    if (!matched) {
      return res.status(404).json("Invalid credentials");
    }

    // Generate tokens
    const payload = {
      id: user._id.toString(),
      email,
    };
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Store refresh token in the database
    user.refreshToken = refreshToken;
    await user.save();

    // Set tokens in Cookie & Send tokens in response
    res.cookie("accessToken", accessToken, {
      maxAge: 60 * 60 * 1000,
      secure: true,
      httpOnly: true,
    });

    res.json({
      accessToken,
      refreshToken,
      user: { ...payload, name: user.name },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }

  try {
    // Verify refresh token
    const payload = jwt.verifyToken(refreshToken, "refresh");
    if (!payload) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    // Find user and validate the refresh token
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token" });
    }

    // Generate new access token
    const newAccessToken = user.generateAccessToken();

    // Send new access token
    res.cookie("accessToken", newAccessToken, {
      maxAge: 60 * 60 * 1000,
      secure: true,
      httpOnly: true,
    });
    res.json({
      accessToken: newAccessToken,
      user: { id: user._id.toString(), email: user.email, name: user.name },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  try {
    // Find user and remove the refresh token
    const user = await User.findOneAndUpdate(
      { refreshToken },
      { refreshToken: null }
    );
    if (!user) return res.status(400).json({ message: "Invalid request" });

    // Delete cookie in client
    res.cookie("accessToken", "", {
      maxAge: 0,
      secure: true,
      httpOnly: true,
    });

    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyUserEmail = async (req: Request, res: Response) => {
  const { token } = req.query;
  try {
    if (!token) return res.status(400).json({ message: "Token not found" });

    const payload = jwt.verifyToken(token as string, "email");
    if (!payload)
      return res.status(400).json({ message: "Invalid or expired token" });

    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isVerified = true; // Set the user as verified
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
