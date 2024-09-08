import express from "express";
import {
  abilityMiddleware,
  authMiddleware,
  authMiddlewareSafe,
} from "../middlewares";
import { createBlogPost, readBlogPost, readBlogPosts } from "../controllers/";

const router = express.Router();

router.get("/", authMiddlewareSafe, abilityMiddleware, readBlogPosts);
router.get("/:id", authMiddlewareSafe, abilityMiddleware, readBlogPost);

router.post("/", authMiddleware, abilityMiddleware, createBlogPost);

export default router;
