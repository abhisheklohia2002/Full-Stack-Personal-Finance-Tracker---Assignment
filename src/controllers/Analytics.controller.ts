import { type NextFunction, type Response } from "express";

import type AnalyticsService from "../services/Analytics.service.js";
import type { IAuthRequest } from "../constant/index.js";
import createHttpError from "http-errors";

class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}
  async summary(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.auth) throw createHttpError(401, "Unauthorized");

      const data = await this.analyticsService.summary(
        req?.auth?.sub,
        req?.auth?.role,
      );

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }

  async categoryBreakdown(
    req: IAuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.auth) throw createHttpError(401, "Unauthorized");

      const data = await this.analyticsService.categoryBreakdown(
        req.auth.sub,
        req.auth.role,
      );

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }

  async trend(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.auth) throw createHttpError(401, "Unauthorized");

      const data = await this.analyticsService.trend(
        req.auth.sub,
        req.auth.role,
        typeof req.query.year === "string" ? req.query.year : undefined,
      );

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }
}
export default AnalyticsController;
