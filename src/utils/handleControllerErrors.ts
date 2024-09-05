import { Request, Response } from "express";
import mongoose from "mongoose";

const handleControllerErrors = (error: any, req: Request, res: Response) => {
  if (error instanceof mongoose.Error) {
    return handleMongooseError(error, res);
  }
  console.error(error);
  return res.status(500).json({ message: error.message || "Server Error" });
};

const handleMongooseError = (error: mongoose.Error, res: Response) => {
  let status = 500,
    name = error.name,
    message = error.message,
    errors;

  console.log("error instance name: ", error.constructor.name);
  //   console.log("error: ", error);

  if (error instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = "Validation failed";
    errors = error.errors;
  }

  //   handle other error types

  return res.status(400).json({
    message,
    name,
    errors,
  });
};

export default handleControllerErrors;
