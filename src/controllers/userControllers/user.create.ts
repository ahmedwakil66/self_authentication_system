import { Request, Response } from "express";
import User from "../../models/userModel";
import handleControllerErrors from "../../utils/handleControllerErrors";

export const createUser = async (req: Request, res: Response) => {
    try {
      const { name, password } = req.body;
      const email = (req.body.email as string).toLowerCase();
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
      }
      // Save new user
      const user = new User({ name, email, password });
      await user.save();
     
      // Send response
      res.status(201).json({
        message:
          "Account created. We have sent a verification link to your email. Please verify your email address as soon as possible. Don't forget to check your spam folder if you don't receive it.",
        user: {
          id: user._id.toString(),
        },
      });
    } catch (error: any) {
      return handleControllerErrors(error, req, res);
    }
  };