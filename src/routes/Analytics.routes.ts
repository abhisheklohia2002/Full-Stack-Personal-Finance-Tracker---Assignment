import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import AnalyticsController from "../controllers/Analytics.controller.js";
import AnalyticsService from "../services/Analytics.service.js";
import autenications from "../middleware/autenications.js";
import { canAccess } from "../middleware/canAccess.js";
import { AppDataSource } from "../config/data-source.js";
import Transaction from "../entity/transaction.js";

const analyticsRouter = express.Router();
const transactionRepository = AppDataSource.getRepository(Transaction);

const analyticsService = new AnalyticsService(transactionRepository);
const analyticsController = new AnalyticsController(analyticsService);


/**
 * @openapi
 * /api/analytics/summary:
 *   get:
 *     summary: Get analytics summary
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     description: "Allowed roles: admin, user, read-only"
 *     responses:
 *       200:
 *         description: Summary analytics returned
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
analyticsRouter.get(
  "/summary",
  autenications,
  canAccess(["admin","user", "read-only"]),
  (req: Request, res: Response, next: NextFunction) =>
    analyticsController.summary(req, res, next),
);


/**
 * @openapi
 * /api/analytics/category-breakdown:
 *   get:
 *     summary: Get category-wise breakdown analytics
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     description: "Allowed roles: admin, user, read-only"
 *     responses:
 *       200:
 *         description: Category breakdown returned
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
analyticsRouter.get(
  "/category-breakdown",
  autenications,
  canAccess(["admin","user", "read-only"]),
  (req: Request, res: Response, next: NextFunction) =>
    analyticsController.categoryBreakdown(req, res, next),
);


/**
 * @openapi
 * /api/analytics/trend:
 *   get:
 *     summary: Get transactions trend analytics
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     description: "Allowed roles: admin, user, read-only"
 *     responses:
 *       200:
 *         description: Trend analytics returned
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
analyticsRouter.get(
  "/trend",
  autenications,
  canAccess(["admin", "user", "read-only"]),
  (req: Request, res: Response, next: NextFunction) =>
    analyticsController.trend(req, res, next),
);
export default analyticsRouter;
