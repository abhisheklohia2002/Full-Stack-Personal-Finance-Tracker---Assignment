import type { NextFunction, Request, Response } from "express";

import createHttpError from "http-errors";
import type { IAuthRequest } from "../constant/index.js";

export const canAccess = (roles:string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const _req = req as IAuthRequest;
    const roleFromToken = _req?.auth?.role as string;
    if (!roles.includes(roleFromToken)) {
      next(createHttpError(403, "you dont have permission"));
      return;
    }
    next();
  };
};
