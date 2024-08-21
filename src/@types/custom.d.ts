import { DecodedPayload } from "../config/jwt";
// import { Request } from "express";

// declare module "express-serve-static-core" {
//   interface Request {
//     decoded?: DecodedPayload;
//   }
// }

declare global {
  namespace Express {
    interface Request {
      decoded?: DecodedPayload
    }
  }
}

// declare module Express {
//   export interface Request {
//     decoded?: DecodedPayload;
//   }
// }