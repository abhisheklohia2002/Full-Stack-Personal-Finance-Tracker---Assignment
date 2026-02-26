import fs from "fs";
import createHttpError from "http-errors";
import jwt, { type JwtPayload } from "jsonwebtoken";
import path from "path";
class TokenService {


  getPrivateKey(): string {
    const keyPath = path.resolve(process.cwd(), "certs", "private.pem");
    if (!fs.existsSync(keyPath)) {
      throw createHttpError(500, `Private key not found at: ${keyPath}`);
    }
    return fs.readFileSync(keyPath, "utf8");
  }

  generateAccessToken(payload: JwtPayload) {
    const privatekey = this.getPrivateKey();
    return jwt.sign(payload,privatekey,{
        algorithm:"RS256",
        expiresIn:'1h',
        issuer:'auth'
    })
  }
}

export default TokenService;
