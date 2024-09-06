import { Request, Response } from "express";
import User from "../../models/userModel";
import handleControllerErrors from "../../utils/handleControllerErrors";
import { ForbiddenError } from "@casl/ability";

// The implement is straightforward
// In real scenario you should not do this
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const ability = req.ability;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    ForbiddenError.from(ability).throwUnlessCan("delete", User);

    if (ability.can("delete", user)) {
      await user.deleteOne();
    }
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    return handleControllerErrors(error, req, res);
  }
};
