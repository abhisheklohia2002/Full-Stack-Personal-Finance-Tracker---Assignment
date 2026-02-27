import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV ?? "development";
const envPath = path.resolve(__dirname, `../../.env.${env}`);
if (!fs.existsSync(envPath)) {
  throw new Error(`Env file not found: ${envPath}`);
}

config({ path: envPath });

function required(name: string): string {
  const value = process.env[name];
  if (value === undefined || value.trim() === "") {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function requiredNumber(name: string): number {
  const raw = required(name);
  const num = Number(raw);
  if (!Number.isFinite(num)) {
    throw new Error(`Env var ${name} must be a valid number. Got: "${raw}"`);
  }
  return num;
}
export const Config = {
  NODE_ENV: env,
  DB_HOST: required("DB_HOST"),
  DB_PORT: requiredNumber("DB_PORT"),
  DB_USER: required("DB_USER"),
  DB_PASSWORD: required("DB_PASSWORD"),
  DB_NAME: required("DB_NAME"),
  PORT: requiredNumber("PORT"),
  SECRET_KEY: required("REFRESH_TOKEN_SECRET"),
  JWKS_URI: required("JWKS_URI"),
  REDIS_HOST:required('REDIS_HOST'),
  REDIS_PORT:required('REDIS_PORT'),
} as const;
