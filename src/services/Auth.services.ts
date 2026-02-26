import type { Repository } from "typeorm";
import type { IAuthUser, ILogin } from "../constant/index.js";
import type { AuthUser } from "../entity/user.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";

class AuthService {
  constructor(private readonly userRepository: Repository<AuthUser>) {}

  async hashPassword(password: string) {
    const saltRound = 10;
    return await bcrypt.hash(password, saltRound);
  }

  async comparePassword(password: string, dbPassword: string) {
    const isValid = await bcrypt.compare(password, dbPassword);
    return isValid;
  }

  async create(payload: IAuthUser) {
    const { firstName, lastName, email, password, role } = payload;

    const isUserExist = await this.userRepository.findOne({
      where: { email },
    });
    if (isUserExist) {
      throw createHttpError(400, "Email already exists");
    }

    const user = await this.userRepository.save({
      firstName,
      lastName,
      email,
      password: await this.hashPassword(password),
      role,
    });
    return user;
  }

  async login(payload: ILogin) {
    const { email, password } = payload;
    const isExisted = await this.userRepository.findOne({
      where: { email },
      select: ["email", "password", "firstName", "id", "lastName", "role"],
    });
    if (!isExisted) {
      throw createHttpError(400, "Invalid email or password");
    }

    const isPasswordValid = await this.comparePassword(
      password,
      isExisted.password,
    );
    if (!isPasswordValid) {
      throw createHttpError(400, "Invalid email or password");
    }
    return isExisted;
  }
}

export default AuthService;
