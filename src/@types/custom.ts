import { DecodedPayload } from "./jwt";
import { MongoAbility } from '@casl/ability';
// import { Request } from "express";

// declare module "express-serve-static-core" {
//   interface Request {
//     decoded?: DecodedPayload;
//   }
// }

declare global {
  namespace Express {
    interface Request {
      decoded?: DecodedPayload;
      ability: MongoAbility;
    }
  }
}

// declare module Express {
//   export interface Request {
//     decoded?: DecodedPayload;
//   }
// }