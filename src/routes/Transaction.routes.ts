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

/**
 * @openapi
 * /api/transaction:
 *   post:
 *     summary: Create a transaction
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     description: "Allowed roles: admin, user"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, amount, category, transactionDate]
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: expense
 *               amount:
 *                 type: number
 *                 format: float
 *                 example: 2500
 *               category:
 *                 type: string
 *                 description: Must be one of allowed category enum values
 *                 example: "HOTEL"
 *               transactionDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-02-27"
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
transactionRouter.post(
  "/",
  autenications,
  canAccess(["admin", "user"]),
  transactionValidator,
  (req: Request, res: Response, next: NextFunction) =>
    transactionController.create(req, res, next),
);

/**
 * @openapi
 * /api/transaction/{id}:
 *   put:
 *     summary: Update a transaction
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     description: "Allowed roles: admin, user"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               amount:
 *                 type: number
 *               category:
 *                 type: string
 *               transactionDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Transaction not found
 *   delete:
 *     summary: Delete a transaction
 *     tags:
 *       - Transaction
 *     security:
 *       - bearerAuth: []
 *     description: "Allowed roles: admin, user"
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Transaction id
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Transaction not found
 */




transactionRouter.put(
  "/:id",
  autenications,
  canAccess(["admin", "user"]),
  (req: Request, res: Response, next: NextFunction) =>
    transactionController.update(req, res, next),
);



transactionRouter.delete(
  "/:id",
  autenications,
  canAccess(["admin", "user"]),
  (req: Request, res: Response, next: NextFunction) =>
    transactionController.delete(req, res, next),
);

/**
 * @openapi
 * /api/transaction:
 *   get:
 *     summary: List transactions
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     description: "Allowed roles: admin, user,read-only"
 *     responses:
 *       200:
 *         description: Transactions fetched successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
transactionRouter.get(
  "/",
  autenications,
  canAccess(["admin", "user", "read-only"]),
  transactionController.list,
);

export default transactionRouter;
