import { Request, Response } from "express";
import { permittedFieldsOf } from "@casl/ability/extra";
import pick from "lodash/pick";
import User from "../../models/userModel";
import { ForbiddenError } from "@casl/ability";
import handleControllerErrors from "../../utils/handleControllerErrors";
import { User_Fields } from './';

export const readAllUsers = async (req: Request, res: Response) => {
  try {
    const ability = req.ability;

    ForbiddenError.from(ability).throwUnlessCan("readList", User);
    const fields = permittedFieldsOf(ability, "readList", User, {
      fieldsFrom: (rule) => rule.fields || User_Fields,
    });

    const users = await User.find(
      {},
      fields.reduce((acc: Record<string, number>, cur) => {
        acc[cur] = 1;
        return acc;
      }, {})
    );

    return res.json(users);
  } catch (error: any) {
    return handleControllerErrors(error, req, res);
  }
};

export const readSingleUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const ability = req.ability;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const fields = permittedFieldsOf(ability, "read", user, {
      fieldsFrom: (rule) => rule.fields || User_Fields,
    });

    return res.json(pick(user, fields));
  } catch (error: any) {
    return handleControllerErrors(error, req, res);
  }
};
