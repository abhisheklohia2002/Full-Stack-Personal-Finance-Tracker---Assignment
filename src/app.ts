import  fs from 'fs';
import "reflect-metadata";
import express from "express";
import swaggerUi from "swagger-ui-express";
import authRouter from "./routes/Auth.routes.js";
import categoryRouter from "./routes/Category.routes.js";
import transactionRouter from "./routes/Transaction.routes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import cors from 'cors'
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";
import analyticsRouter from "./routes/Analytics.routes.js";
import { swaggerSpec } from "./config/swagger.js";
import { apiRateLimiter, authRateLimiter } from "./middleware/rateLimit.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set("trust proxy", 1);
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://full-stack-personal-finance-tracker-lrg3.onrender.com"
  ],
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
// app.use("/api", apiRateLimiter);
// app.use("/api/auth", authRateLimiter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api/docs.json", (_req, res) => res.json(swaggerSpec));
app.use("/api/auth",authRouter);
app.use('/api/transaction/',transactionRouter)
app.use("/api/category",categoryRouter);
app.use('/api/analytics',analyticsRouter)

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api/docs.json", (_req, res) => res.json(swaggerSpec));

app.use(express.static(path.join(__dirname, "../public"), { dotfiles: "allow" }));
app.get("/.well-known/jwks.json", (_req, res) => {
  res.sendFile(path.join(__dirname, "../public/.well-known/jwks.json"));
});
app.get("/", (req, res) => {
  res.send("<h1>Welcome to the Finacial Service</h1>");
});
app.get("/debug-jwks", (_req, res) => {
  const p = path.join(__dirname, "../public/.well-known/jwks.json");
  res.json({ path: p, exists: fs.existsSync(p) });
});

app.use(globalErrorHandler)

export default app;
