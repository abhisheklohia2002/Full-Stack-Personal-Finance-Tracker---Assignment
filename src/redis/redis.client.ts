/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Redis from "ioredis";
import { Config } from "../config/index.js";

export const redis = new Redis({
  host: Config.REDIS_HOST,
  port: Number(Config.REDIS_PORT),
});