import { Request, Response } from "express";
import { permittedFieldsOf } from "@casl/ability/extra";
import _ from "lodash";

import BlogPost, { IBlogPost } from "../../models/blogModel";
import handleControllerErrors from "../../utils/handleControllerErrors";
import { BlogPost_Fields } from "./";

export const updateBlogPost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const blogPost = await BlogPost.findById(id);

    if (!blogPost)
      return res.status(404).json({ message: "Blog post not found" });

    const ability = req.ability;

    const permittedFields = permittedFieldsOf(ability, "update", blogPost, {
      fieldsFrom: (rule) => rule.fields || BlogPost_Fields,
    });
    const notPermittedFields = _.difference(
      Object.keys(req.body),
      permittedFields
    );

    if (!ability.can("update", blogPost)) {
      return res.status(403).json({
        message: `You don't have sufficient permission for this action`,
      });
    } else if (notPermittedFields.length > 0) {
      return res.status(403).json({
        message: `You don't have sufficient permission to update these fields: [${notPermittedFields.join(
          ", "
        )}]`,
      });
    }

    const updatedDoc: Partial<IBlogPost> = _.pick(req.body, permittedFields);
    for (const [key, value] of Object.entries(updatedDoc)) {
      (blogPost[key as keyof IBlogPost] as typeof value) = value;
    }

    await blogPost.save();
    res
      .status(200)
      .json({ updated: updatedDoc, message: "Updated successfully" });
  } catch (error) {
    return handleControllerErrors(error, req, res);
  }
};
