import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserInput } from "./dtos/create-user.dto";
import { LoginInput } from "./dtos/login-users.dto";
import { User } from "./entities/user.entity";
import * as jwt from "jsonwebtoken";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "src/jwt/jwt.service";
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly jwt: JwtService
  ) {}
  async createAccount({
    email,
    password,
    role,
  }: CreateUserInput): Promise<{ ok: boolean; error?: string }> {
    try {
      const exist = await this.users.findOne({ where: { email } });
      if (exist) {
        return { ok: false, error: "this email is already used" };
      }
      await this.users.save(this.users.create({ email, password, role }));
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "there is error try again" };
    }
  }
  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      const targetUser = await this.users.findOne({ where: { email } });
      if (!targetUser) {
        return { ok: false, error: "user not found" };
      } else {
        const isPasswordCorrect = await targetUser.checkPassword(password);
        if (isPasswordCorrect) {
          const token = this.jwt.sign(targetUser.id);
          console.log(token);
          return { ok: true, token: token };
        }
        return { ok: false, error: "password is not correct" };
      }
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
  async findById(id: number): Promise<User> {
    return await this.users.findOne({ where: { id } });
  }
}
