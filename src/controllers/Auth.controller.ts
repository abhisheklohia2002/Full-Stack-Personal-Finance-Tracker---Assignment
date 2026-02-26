import { type NextFunction, type Request, type Response } from "express";
import type AuthService from "../services/Auth.services.js";
import type { IAuthRequest, IAuthUser, ILogin } from "../constant/index.js";
import { validationResult } from "express-validator";
import type { JwtPayload } from "jsonwebtoken";
import type TokenService from "../services/Token.service.js";
import createHttpError from "http-errors";

class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}
  async create(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ error: result.array() });
    }
    try {
      const { role, email, firstName, lastName } = req.body as IAuthUser;
      const create = await this.authService.create(req.body as IAuthUser);
      const payload: JwtPayload = {
        role,
        email,
        firstName,
        lastName,
        sub: String(create?.id),
      };

      const accessToken = this.tokenService.generateAccessToken(payload);
      res.cookie("accessToken", accessToken, {
        domain: "localhost",
        sameSite: "strict",
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...body } = create;
      res.status(200).json({ msg: "user create successfully", user: body });
    } catch (error) {
      next(error);
      return;
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).json({ error: result.array() });
    }
    const { email } = req.body as ILogin;
    
    try {
      const isExisted = await this.authService.login(req.body as ILogin);
      const payload: JwtPayload = {
        role: isExisted.role,
        email,
        firstName: isExisted.firstName,
        lastName: isExisted.lastName,
        sub: String(isExisted?.id),
      };

      const accessToken = this.tokenService.generateAccessToken(payload);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
        domain: "localhost",
      });
      res.status(200).json({ msg: "login successfully", data:isExisted});
    } catch (error) {
      next(error);
      return;
    }
  }


  async self(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.auth?.sub;

      if (!userId) {
        return next(createHttpError(401, "Unauthorized"));
      }

      const user = await this.authService.findById(+userId);

      if (!user) {
        return next(createHttpError(404, "User not found"));
      }

      return res.status(200).json({ user: user });
    } catch (error) {
      next(error);
    }
  }



   logout(req: IAuthRequest, res: Response, next: NextFunction) {
    try {
      res.clearCookie("accessToken");
      res.status(200).json({ msg: "logout successfully" });
    } catch (error) {
      return next(error);
    }
  }
}
export default AuthController;
