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

analyticsRouter.get(
  "/summary",
  autenications,
  canAccess(["admin,user", "read-only", "user"]),
  (req: Request, res: Response, next: NextFunction) =>
    analyticsController.summary(req, res, next),
);

analyticsRouter.get(
  "/category-breakdown",
  autenications,
  canAccess(["admin,user", "read-only", "user"]),
  (req: Request, res: Response, next: NextFunction) =>
    analyticsController.categoryBreakdown(req, res, next),
);

analyticsRouter.get(
  "/trend",
  autenications,
  canAccess(["admin", "user", "read-only"]),
  (req: Request, res: Response, next: NextFunction) =>
    analyticsController.trend(req, res, next),
);
export default analyticsRouter;
