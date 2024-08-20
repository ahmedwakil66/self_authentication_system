import express from "express";
import {
  createUser,
  getAllUsers,
  updateUser,
} from "../controllers/userController";
import {
  authMiddleware,
  ownerAuthMiddleware,
} from "@/middlewares/authMiddleware";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", createUser);
router.put("/:userId", authMiddleware, ownerAuthMiddleware, updateUser);

export default router;
