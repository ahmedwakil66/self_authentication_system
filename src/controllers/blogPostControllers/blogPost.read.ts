import { Request, Response } from "express";
import { ForbiddenError } from "@casl/ability";
import { permittedFieldsOf } from "@casl/ability/extra";
import pick from "lodash/pick";

import BlogPost from "../../models/blogModel";
import handleControllerErrors from "../../utils/handleControllerErrors";
import { BlogPost_Fields } from "./";

export const readBlogPosts = async (req: Request, res: Response) => {
  try {
    const ability = req.ability;
    ForbiddenError.from(ability).throwUnlessCan("readList", BlogPost);

    const possibleRule = ability.possibleRulesFor("readList", BlogPost);
    // Combining all possible rule to construct an $or query
    // For minimal permitted visitor - [{ status: 'published' }]
    // Normal logged-in user   - [{ status: 'published'},
    //                            { author: new ObjectId('logged-in-user-id') }]
    // For Admin users       - [{},
    //                          { status: 'published' },
    //                          { author: new ObjectId('admin-user-id') }]
    // So, the more permission a user have, the more it will see
    const combinedPossibleFilter = possibleRule.map((pr) => ({
      ...pr.conditions,
    }));

    const blogPosts = await BlogPost.find({
      $or: combinedPossibleFilter,
    }).populate("author", "name");

    return res.status(200).json(blogPosts);
  } catch (error) {
    return handleControllerErrors(error, req, res);
  }
};

export const readBlogPost = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const ability = req.ability;
    ForbiddenError.from(ability).throwUnlessCan("read", BlogPost);

    const blogPost = await BlogPost.findById(id).populate("author", "name");
    if (!blogPost)
      return res.status(404).json({ message: "Blog post not found" });

    if (!ability.can("read", blogPost)) {
      return res.status(403).json({
        message: "You don't have sufficient permission for this action",
      });
    }

    const fields = permittedFieldsOf(ability, "read", blogPost, {
      fieldsFrom: (rule) => rule.fields || BlogPost_Fields,
    });

    return res.json(pick(blogPost, fields));
  } catch (error) {
    return handleControllerErrors(error, req, res);
  }
};
