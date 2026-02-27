import type { Repository } from "typeorm";
import type Transaction from "../entity/transaction.js";
import type {
  ICreateTransaction,
  ITransactionQuery,
} from "../constant/index.js";
import createHttpError from "http-errors";

class TransactionService {
  constructor(private transactionRepo: Repository<Transaction>) {}
  create(payload: ICreateTransaction) {
    const { user, type, amount, category, transactionDate } = payload;
    const create = this.transactionRepo.save({
      user: { id: user },
      type,
      amount,
      category,
      transactionDate,
    });
    return create;
  }

  async update(
    txId: number,
    authUserId: number,
    role: string,
    payload: ICreateTransaction,
  ) {
    if (!txId || Number.isNaN(txId))
      throw createHttpError(400, "Invalid transaction id");

    const qb = this.transactionRepo
      .createQueryBuilder("t")
      .leftJoinAndSelect("t.user", "user")
      .where("t.id = :txId", { txId });

    if (role !== "admin") {
      qb.andWhere("user.id = :authUserId", { authUserId });
    }

    const tx = await qb.getOne();
    if (!tx) throw createHttpError(404, "Transaction not found");

    if (payload.type) tx.type = payload.type;
    if (payload.amount !== undefined) tx.amount = payload.amount;
    if (payload.category) tx.category = payload.category;
    if (payload.transactionDate) tx.transactionDate = payload.transactionDate;

    return this.transactionRepo.save(tx);
  }

  async delete(txId: number, authUserId: string, role: string) {
    if (!txId || Number.isNaN(txId))
      throw createHttpError(400, "Invalid transaction id");

    const qb = this.transactionRepo
      .createQueryBuilder("t")
      .leftJoin("t.user", "user")
      .where("t.id = :txId", { txId });

    if (role !== "admin") {
      qb.andWhere("user.id = :authUserId", { authUserId });
    }

    const tx = await qb.getOne();
    if (!tx) throw createHttpError(404, "Transaction not found");

    await this.transactionRepo.remove(tx);
    return { deleted: true };
  }

  async list(authUserId: string, role: string, query: ITransactionQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const qb = this.transactionRepo
      .createQueryBuilder("t")
      .leftJoinAndSelect("t.user", "user")
      .orderBy("t.transactionDate", "DESC")
      .addOrderBy("t.id", "DESC")
      .skip(skip)
      .take(limit);
    console.log("ROLE:", role, "AUTH_USER:", authUserId);
    // eslint-disable-next-line no-constant-condition
    if (role == "user") {
      qb.where("user.id = :authUserId", { authUserId });
    } else {
      qb.where("1=1");
    }

    if (query.type) {
      qb.andWhere("t.type = :type", { type: query.type });
    }

    if (query.category) {
      qb.andWhere("t.category = :category", { category: query.category });
    }

    if (query.from) {
      qb.andWhere("t.transactionDate >= :from", { from: query.from });
    }

    if (query.to) {
      qb.andWhere("t.transactionDate <= :to", { to: query.to });
    }

    const search = query.search?.trim();
    if (search) {
      qb.andWhere("LOWER(t.note) LIKE :search", {
        search: `%${search.toLowerCase()}%`,
      });
    }

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

export default TransactionService;
