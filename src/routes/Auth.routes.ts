import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import AuthController from "../controllers/Auth.controller.js";
import AuthService from "../services/Auth.services.js";
import { registerValidator } from "../validators/register.js";
import { AppDataSource } from "../config/data-source.js";
import { AuthUser } from "../entity/user.js";
import TokenService from "../services/Token.service.js";
import loginValidator from "../validators/login.js";

const authRouter = express.Router();
const userRepository = AppDataSource.getRepository(AuthUser);
const authService = new AuthService(userRepository);
const tokenService = new TokenService();
const authController = new AuthController(authService, tokenService);
authRouter.post(
  "/register",
  registerValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.create(req, res, next),
);

authRouter.post("/login",loginValidator ,(req: Request, res: Response, next: NextFunction) =>
  authController.login(req, res, next),
);

export default authRouter;
