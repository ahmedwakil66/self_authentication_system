import { Request, Response } from "express";
import { permittedFieldsOf } from "@casl/ability/extra";
import pick from "lodash/pick";
import User, { IUser } from "../../models/userModel";
import handleControllerErrors from "../../utils/handleControllerErrors";
import { User_Fields } from './';

export const updateUser = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const ability = req.ability;
  
      const userToUpdate = await User.findById(userId);
      if (!userToUpdate)
        return res.status(404).json({ message: "User not found" });
  
      if (!ability.can("update", userToUpdate)) {
        return res.status(403).json({
          message: "You don't have sufficient permission for this action",
        });
      }
  
      const fields = permittedFieldsOf(ability, "update", userToUpdate, {
        fieldsFrom: (rule) => rule.fields || User_Fields,
      });
      // Caution: role field will be replaced all together (if permitted & present)
      // OptionalTodo: insert or remove single role value
      const updatedDoc: Partial<IUser> = pick(req.body, fields);
      for (const [key, value] of Object.entries(updatedDoc)) {
        (userToUpdate[key as keyof IUser] as typeof value) = value;
      }
      await userToUpdate.save();
  
      res.json({ updated: updatedDoc, message: "Updated successfully" });
    } catch (error: any) {
      return handleControllerErrors(error, req, res);
    }
  };