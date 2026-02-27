import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from "./index.js";
import { AuthUser } from "../entity/user.js";
import Category from "../entity/categories.js";
import Transaction from "../entity/transaction.js";
const isProd = Config.NODE_ENV === "production";
export const AppDataSource = new DataSource({
  type: "postgres",
  host: Config.DB_HOST,
  port: Config.DB_PORT,
  username: Config.DB_USER,
  password: Config.DB_PASSWORD,
  database: Config.DB_NAME,
  url: Config.DATABASE_URL,
  ssl: isProd ? { rejectUnauthorized: false } : false,
  synchronize: true,
  logging: false,
  entities: [AuthUser,Category,Transaction],
});
