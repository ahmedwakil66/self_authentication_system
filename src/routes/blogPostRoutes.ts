import express from "express";
import {
  abilityMiddleware,
  authMiddleware,
  authMiddlewareSafe,
} from "../middlewares";
import {
  createBlogPost,
  deleteBlogPost,
  readBlogPost,
  readBlogPosts,
  updateBlogPost,
} from "../controllers/";

const router = express.Router();

router.get("/", authMiddlewareSafe, abilityMiddleware, readBlogPosts);
router.get("/:id", authMiddlewareSafe, abilityMiddleware, readBlogPost);

router.post("/", authMiddleware, abilityMiddleware, createBlogPost);
router.put("/:id", authMiddleware, abilityMiddleware, updateBlogPost);

router.delete("/:id", authMiddleware, abilityMiddleware, deleteBlogPost);

export default router;
