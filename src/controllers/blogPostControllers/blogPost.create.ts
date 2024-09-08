import { Request, Response } from "express";
import BlogPost, { IBlogPost } from "../../models/blogModel";
import handleControllerErrors from "../../utils/handleControllerErrors";

export const createBlogPost = async (req: Request, res: Response) => {
  try {
    const { title, body, tags, status } = req.body as Partial<IBlogPost>;
    const blogPost = new BlogPost({
      title,
      body,
      tags,
      status,
      author: req.decoded?.id,
    });
    await blogPost.save();

    res.status(201).json({
      message: "Blog post has been created",
      insertedId: blogPost._id,
    });
  } catch (error) {
    return handleControllerErrors(error, req, res);
  }
};
