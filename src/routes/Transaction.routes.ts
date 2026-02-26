import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";

import { AppDataSource } from "../config/data-source.js";
import Transaction from "../entity/transaction.js";
import TransactionService from "../services/Transaction.service.js";
import TransactionController from "../controllers/Transaction.controller.js";
import autenications from "../middleware/autenications.js";
import { canAccess } from "../middleware/canAccess.js";
import { transactionValidator } from "../validators/transaction.js";


const transactionRouter = express.Router();
const transactionRepository = AppDataSource.getRepository(Transaction);

const transactionService = new TransactionService(transactionRepository);
const transactionController = new TransactionController(transactionService);
transactionRouter.post(
  "/", 
  autenications,
  canAccess(['admin','user']),
  transactionValidator,
  (req: Request, res: Response, next: NextFunction) =>
    transactionController.create(req, res, next),
);


transactionRouter.put(
  "/:id", 
  autenications,
  canAccess(['admin','user']),
  (req: Request, res: Response, next: NextFunction) =>
    transactionController.update(req, res, next),
);


transactionRouter.delete(
  "/:id", 
  autenications,
  canAccess(['admin','user']),
  (req: Request, res: Response, next: NextFunction) =>
    transactionController.delete(req, res, next),
);


transactionRouter.get(
  "/",
  autenications,
  canAccess(["admin", "user", "read-only"]),
  transactionController.list
);

export default transactionRouter;
