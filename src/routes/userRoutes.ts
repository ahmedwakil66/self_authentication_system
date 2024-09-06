import express from "express";
import {
  createUser,
  readAllUsers,
  readSingleUser,
  updateUser,
  deleteUser
} from "../controllers";
import {
  authMiddleware,
  abilityMiddleware,
  authMiddlewareSafe,
} from "../middlewares";

const router = express.Router();

router.get("/", authMiddlewareSafe, abilityMiddleware, readAllUsers);
router.get("/:userId", authMiddlewareSafe, abilityMiddleware, readSingleUser);

router.post("/", createUser);
router.put("/:userId", authMiddleware, abilityMiddleware, updateUser);

router.delete('/:userId', authMiddleware, abilityMiddleware, deleteUser)

export default router;
