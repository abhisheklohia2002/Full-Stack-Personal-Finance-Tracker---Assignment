import { type NextFunction, type Request, type Response } from "express";
import type TransactionService from "../services/Transaction.service.js";
import type { IAuthRequest, ICreateTransaction } from "../constant/index.js";
import createHttpError from "http-errors";

class TransactionController {
  constructor(private transactionService: TransactionService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const create = await this.transactionService.create(
        req.body as ICreateTransaction,
      );
      return res
        .status(201)
        .json({ msg: "transaction create successfully", txt: create });
    } catch (error) {
      next(error);
    }
  }

  async update(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const txId = Number(req.params.id);

      if (!req.auth) {
        return next(createHttpError(401, "Unauthorized"));
      }

      const data = await this.transactionService.update(
        txId,
        +req.auth.sub,
        req.auth.role,
        req.body as ICreateTransaction,
      );

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const txId = Number(req.params.id);

      if (!req.auth) throw createHttpError(401, "Unauthorized");

      const data = await this.transactionService.delete(
        txId,
        req.auth.sub,
        req.auth.role,
      );

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }

  list = async (req: IAuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.auth) throw createHttpError(401, "Unauthorized");

      const data = await this.transactionService.list(
        req.auth.sub,
        req.auth.role,
        req.query,
      );

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };
}

export default TransactionController;
