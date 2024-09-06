import express from "express";
import {
  login,
  logout,
  refreshAccessToken,
  verifyUserEmail,
} from "../controllers";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshAccessToken);
router.get("/verify-email", verifyUserEmail);

export default router;
