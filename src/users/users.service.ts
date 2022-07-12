import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserInput } from "./dtos/create-user.dto";
import { UserAccount } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserAccount)
    private users: Repository<UserAccount>
  ) {}
  async createAccount({
    email,
    password,
    role,
  }: CreateUserInput): Promise<string | undefined> {
    try {
      const exist = await this.users.findOne({ where: { email } });
      if (exist) {
        return "this email is already used";
      }
      await this.users.save(this.users.create({ email, password, role }));
    } catch (e) {
      return "there is error try again";
    }
  }
}
