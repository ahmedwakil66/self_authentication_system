import express from "express";
import {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
} from "../controllers/userController";
import {
  authMiddleware,
  abilityMiddleware,
  ownerAuthMiddleware,
  authMiddlewareSafe,
} from "../middlewares";

const router = express.Router();

router.get("/", authMiddlewareSafe, abilityMiddleware, getAllUsers);
router.get("/:userId", authMiddlewareSafe, abilityMiddleware, getSingleUser);

router.post("/", createUser);
router.put("/:userId", authMiddleware, abilityMiddleware, updateUser);

export default router;
