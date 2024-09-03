import { Request, Response } from "express";
import { permittedFieldsOf } from "@casl/ability/extra";
import pick from "lodash/pick";
import User from "../models/userModel";
import * as mailService from "../services/mailService";

const User_Fields = [
  "name",
  "email",
  "password",
  "accessToken",
  "refreshToken",
  "isVerified",
  "role",
];

export const getAllUsers = async (req: Request, res: Response) => {
  // Any logged in user can see all user data
  // TODO: implement 'read: list' validation
  try {
    const ability = req.ability;
    const fields = permittedFieldsOf(ability, "read", User, {
      fieldsFrom: (rule) => rule.fields || User_Fields,
    });

    const users = await User.find(
      {},
      fields.reduce((acc: Record<string, number>, cur) => {
        acc[cur] = 1;
        return acc;
      }, {})
    );

    return res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getSingleUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const ability = req.ability;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const fields = permittedFieldsOf(ability, "read", user, {
      fieldsFrom: (rule) => rule.fields || User_Fields,
    });

    return res.json(pick(user, fields));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

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
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    const userToUpdate = await User.findById(userId);
    if (!userToUpdate)
      return res.status(404).json({ message: "User not found" });

    if (!req.ability.can("manage", userToUpdate)) {
      return res.status(403).json({
        message: "You don't have sufficient permission for this action",
      });
    }

    const fields = permittedFieldsOf(req.ability, "manage", userToUpdate, {
      fieldsFrom: (rule) => rule.fields || User_Fields,
    });
    // Caution: role field will be replaced all together (if present)
    // OptionalTodo: insert or remove single role value
    const updatedDoc = pick(req.body, fields);
    await userToUpdate.updateOne(updatedDoc);

    res.json({ updated: updatedDoc, message: "Updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: (error as Error).message || "Server Error" });
  }
};
