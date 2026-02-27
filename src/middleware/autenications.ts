import { expressjwt, type GetVerificationKey } from "express-jwt";
import jwksRsa from "jwks-rsa";
import type { Request } from "express";
import { Config } from "../config/index.js";

if (!Config.JWKS_URI) {
  throw new Error("JWKS_URI is not defined");
}
export default expressjwt({
  secret: jwksRsa.expressJwtSecret({
    jwksUri: Config.JWKS_URI,
    cache: true,
    rateLimit: true,
  }) as GetVerificationKey,

  algorithms: ["RS256"],

  getToken: (req: Request) => {
    const auth = req.headers.authorization;
    if (auth?.startsWith("Bearer ")) return auth.split(" ")[1];

    type AuthCookie = {
      accessToken: string;
    };
    const { accessToken } = req.cookies as AuthCookie;
    return accessToken;
  },
});
