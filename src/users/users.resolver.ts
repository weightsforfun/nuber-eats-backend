import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { boolean } from "joi";
import { CreateUserInput, CreateUserOutput } from "./dtos/create-user.dto";
import { LoginInput, LoginOutput } from "./dtos/login-users.dto";
import { User } from "./entities/user.entity";
import { UserService } from "./users.service";

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly UserService: UserService) {}
  @Query((returns) => String)
  hi() {
    return "hi";
  }
  @Mutation((returns) => CreateUserOutput)
  async createUser(
    @Args("input") CreateUserInput: CreateUserInput
  ): Promise<CreateUserOutput> {
    try {
      const { ok, error } = await this.UserService.createAccount(
        CreateUserInput
      );
      return {
        ok,
        error,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
  @Mutation((returns) => LoginOutput)
  async login(@Args("input") LoginInput: LoginInput): Promise<LoginOutput> {
    try {
      return this.UserService.login(LoginInput);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
