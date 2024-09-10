import { Request, Response } from "express";
import { ForbiddenError } from "@casl/ability";
import _ from "lodash";

import BlogPost from "../../models/blogModel";
import handleControllerErrors from "../../utils/handleControllerErrors";

export const deleteBlogPost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const blogPost = await BlogPost.findById(id);

    if (!blogPost)
      return res.status(404).json({ message: "Blog post not found" });

    const ability = req.ability;
    ForbiddenError.from(ability).throwUnlessCan("delete", blogPost);

    if (!ability.can("delete", blogPost)) {
      return res.status(403).json({
        message: `You don't have sufficient permission for this action`,
      });
    }

    await blogPost.deleteOne();
    return res.status(200).json({ message: "Blog post deleted" });
  } catch (error) {
    return handleControllerErrors(error, req, res);
  }
};
