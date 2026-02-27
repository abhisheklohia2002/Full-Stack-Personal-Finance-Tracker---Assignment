import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV ?? "development";
const envPath = path.resolve(__dirname, `../../.env.${env}`);
const defaultEnvPath = path.resolve(__dirname, "../../.env");

if (fs.existsSync(envPath)) {
  config({ path: envPath });
} else if (fs.existsSync(defaultEnvPath)) {
  config({ path: defaultEnvPath });
} else {
  console.warn(
    `[config] No env file found. Using process.env (NODE_ENV=${env})`
  );
}
function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function requiredNumber(name: string): number {
  const raw = required(name);
  const num = Number(raw);
  if (!Number.isFinite(num)) throw new Error(`${name} must be a number`);
  return num;
}

export const Config = {
  NODE_ENV: env,

  PORT: requiredNumber("PORT"),

  DB_HOST: required("DB_HOST"),
  DB_PORT: requiredNumber("DB_PORT"),
  DB_USER: required("DB_USER"),
  DB_PASSWORD: required("DB_PASSWORD"),
  DB_NAME: required("DB_NAME"),

  DB_SSL: process.env.DB_SSL === "true",

  REFRESH_TOKEN_SECRET: required("REFRESH_TOKEN_SECRET"),
  JWKS_URI: required("JWKS_URI"),
  DATABASE_URL:required('DATABASE_URL'),
  PRIVATE_KEY:required('PRIVATE_KEY')
};