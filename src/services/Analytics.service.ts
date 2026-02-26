import type { Repository } from "typeorm";
import type Transaction from "../entity/transaction.js";
import type { ICategoryBreakdown, ITrend } from "../constant/index.js";
import createHttpError from "http-errors";
import { redis } from "../redis/redis.client.js";
import { Config } from "../config/index.js";

class AnalyticsService {
  constructor(private transactionRepo: Repository<Transaction>) {}
  keySummary(role: string, authUserId: string) {
    return role === "admin"
      ? "analytics:summary:admin"
      : `analytics:summary:user:${authUserId}`;
  }

  keyCategory(role: string, authUserId: string) {
    return role === "admin"
      ? "analytics:category:admin"
      : `analytics:category:user:${authUserId}`;
  }

  keyTrend(role: string, authUserId: string, year: number) {
    return role === "admin"
      ? `analytics:trend:admin:${year}`
      : `analytics:trend:user:${authUserId}:${year}`;
  }

  async summary(authUserId: string, role: string) {
    const cacheKey = this.keySummary(role, authUserId);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const cached = await redis.get(cacheKey);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if (cached) return JSON.parse(cached);
    const qb = this.transactionRepo
      .createQueryBuilder("t")
      .select([
        `COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as "totalIncome"`,
        `COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as "totalExpense"`,
      ]);

    if (role !== "admin") {
      qb.leftJoin("t.user", "user").where("user.id = :authUserId", {
        authUserId,
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const raw = await qb.getRawOne();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const totalIncome = Number(raw?.totalIncome ?? 0);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const totalExpense = Number(raw?.totalExpense ?? 0);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await redis.set(
      cacheKey,
      JSON.stringify({
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense,
      }),
      "EX",
      Config.CACHE_TTL,
    );
    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
    };
  }

  async categoryBreakdown(authUserId: string, role: string) {
    const cacheKey = this.keyCategory(role, authUserId);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const cached = await redis.get(cacheKey);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if (cached) return JSON.parse(cached);
    const qb = this.transactionRepo
      .createQueryBuilder("t")
      .select("t.category", "category")
      .addSelect("COALESCE(SUM(t.amount), 0)", "total")
      .where("t.type = :type", { type: "expense" })
      .groupBy("t.category")
      .orderBy("total", "DESC");

    if (role !== "admin") {
      qb.leftJoin("t.user", "user").andWhere("user.id = :authUserId", {
        authUserId,
      });
    }

    const raw = await qb.getRawMany();

    const result = raw.map((r: ICategoryBreakdown) => ({
      category: r.category,
      total: Number(r.total),
    }));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await redis.set(cacheKey, JSON.stringify(result), "EX", Config.CACHE_TTL);
    return result;
  }

  async trend(authUserId: string, role: string, year?: string) {
    const y = year ? Number(year) : new Date().getFullYear();
    if (Number.isNaN(y)) throw createHttpError(400, "Invalid year");

    const cacheKey = this.keyTrend(role, authUserId, y);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
    const cached = await redis.get(cacheKey);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if (cached) return JSON.parse(cached);

    const qb = this.transactionRepo
      .createQueryBuilder("t")
      .select(
        `TO_CHAR(DATE_TRUNC('month', t."transactionDate"), 'YYYY-MM')`,
        "month",
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0)`,
        "income",
      )
      .addSelect(
        `COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0)`,
        "expense",
      )
      .where(`EXTRACT(YEAR FROM t."transactionDate") = :year`, { year: y })
      .groupBy("month")
      .orderBy("month", "ASC");

    if (role !== "admin") {
      qb.leftJoin("t.user", "user").andWhere("user.id = :authUserId", {
        authUserId,
      });
    }

    const raw = await qb.getRawMany();
    const result = raw.map((r: ITrend) => ({
      month: r.month,
      income: Number(r.income),
      expense: Number(r.expense),
    }));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    await redis.set(cacheKey, JSON.stringify(result), "EX", Config.CACHE_TTL);
    return result;
  }
}
export default AnalyticsService;
