import { Request, Response } from "express";
import User from "../models/userModel";
import * as mailService from "../services/mailService";
import extractUpdatedDoc from "../utils/extractUpdatedDoc";

export const getAllUsers = async (req: Request, res: Response) => {
  // TODO: implement role verification, eg, admin
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    // Save new user
    const user = new User({ name, email, password });
    await user.save();
    // Send verification email
    try {
      await mailService.sendEmailVerificationMail(
        user.generateEmailVerificationToken(),
        user.email
      );
    } catch (error) {
      console.log(error);
      return res.status(201).json({
        message: "Account created. You will need to verify your email address.",
        user: {
          id: user._id.toString(),
        },
      });
    }
    // Send response
    res.status(201).json({
      message:
        "Account created. We have sent a verification link to your email. Please verify your email address as soon as possible. Don't forget to check your spam folder if you don't receive it.",
      user: {
        id: user._id.toString(),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const updatedDoc = extractUpdatedDoc(["name", "password"], req.body);
    await User.findOneAndUpdate({ _id: userId }, updatedDoc, { upsert: true });
    res.json({ updated: updatedDoc, message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: (error as Error).message || "Server Error" });
  }
};
