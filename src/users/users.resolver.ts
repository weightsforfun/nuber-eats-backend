import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { boolean } from "joi";
import { CreateUserInput, CreateUserOutput } from "./dtos/create-user.dto";
import { UserAccount } from "./entities/user.entity";
import { UserService } from "./users.service";

@Resolver((of) => UserAccount)
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
      const error = await this.UserService.createAccount(CreateUserInput);
      if (error) {
        return {
          ok: false,
          error,
        };
      }
      return {
        ok: true,
      };
    } catch (e) {}

    return;
  }
}
