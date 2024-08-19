import express from "express";
import {
  createUser,
  getAllUsers,
  authenticateUser,
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
// router.post("/auth", authenticateUser); // temporary path

export default router;
