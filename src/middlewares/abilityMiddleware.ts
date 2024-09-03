import { Request, Response, NextFunction } from 'express';
import defineAbility from '../permissions';

export const abilityMiddleware = (
    req: Request,
  res: Response,
  next: NextFunction
) => {
    const ability = defineAbility(req.decoded);
    req.ability = ability;
    next();
}