import express from "express";
import {
  login,
  refreshAccessToken,
  verifyUserEmail,
} from "@/controllers/authController";

const router = express.Router();

router.get("/verify-email", verifyUserEmail);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);

export default router;
