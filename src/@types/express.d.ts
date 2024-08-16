import { DecodedPayload } from "@/config/jwt";
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    decoded?: DecodedPayload;
  }
}
