import { Request, Response } from "express";
import User from "@/models/userModel";
import * as mailService from "@/services/mailService";
import extractUpdatedDoc from "@/utils/extractUpdatedDoc";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Save new user
    const user = new User({ name, email, password });
    await user.save();
    // Send verification email
    try {
      await mailService.sendEmailVerificationMail({
        id: user._id.toString(),
        email: user.email,
      });
    } catch (error) {
      return res.status(201).json({
        message: "Account created. You will need to verify your email address.",
      });
    }
    // Send response
    res.status(201).json({
      message:
        "Account created. We have sent a verification link to your email. Please verify your email address as soon as possible. Don't forget to check your spam folder if you don't receive it.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const updatedDoc = extractUpdatedDoc(
      ["name", "password"],
      req.body.updatedDoc
    );
    await User.findOneAndUpdate({ _id: userId }, updatedDoc, { upsert: true });
    res.json({ updatedDoc, message: "Updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: (error as Error).message || "Server Error" });
  }
};

// Temporary method: authenticateUser
export const authenticateUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json("Incorrect email or password");
    }
    const matched = await user.comparePassword(password);
    if (!matched) {
      return res.status(404).json("Incorrect email or password");
    }
    res.json("Successfully authenticated");
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
