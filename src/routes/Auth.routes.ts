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
import autenications from "../middleware/autenications.js";
import { canAccess } from "../middleware/canAccess.js";

const authRouter = express.Router();
const userRepository = AppDataSource.getRepository(AuthUser);
const authService = new AuthService(userRepository);
const tokenService = new TokenService();
const authController = new AuthController(authService, tokenService);

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Abhishek Lohia"
 *               email:
 *                 type: string
 *                 example: "admin@tripxl.com"
 *               password:
 *                 type: string
 *                 example: "admin@123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */
authRouter.post(
  "/register",
  registerValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.create(req, res, next),
);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@tripxl.com"
 *               password:
 *                 type: string
 *                 example: "admin@123"
 *     responses:
 *       200:
 *         description: Login successful
 */
authRouter.post(
  "/login",
  loginValidator,
  (req: Request, res: Response, next: NextFunction) =>
    authController.login(req, res, next),
);

/**
 * @openapi
 * /api/auth/self:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user returned
 *       401:
 *         description: Unauthorized
 */
authRouter.get(
  "/self",
  autenications,
  (req: Request, res: Response, next: NextFunction) =>
    authController.self(req, res, next),
);

/**
 * @openapi
 * /api/auth/user:
 *   get:
 *     summary: List users (Admin only)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users list returned
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not admin)
 */
authRouter.get(
  "/user",
  autenications,
  canAccess(["admin"]),
  (req: Request, res: Response, next: NextFunction) =>
    authController.list(req, res, next),
);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
authRouter.post(
  "/logout",
  autenications,
  (req: Request, res: Response, next: NextFunction) =>
    authController.logout(req, res, next),
);

export default authRouter;
