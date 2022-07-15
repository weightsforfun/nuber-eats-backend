import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { CreateUserInput, CreateUserOutput } from "./dtos/create-user.dto";
import { EditProfileInput, EditProfileOutPut } from "./dtos/edit-profile.dto";
import { LoginInput, LoginOutput } from "./dtos/login-users.dto";
import { UserProfileInput, UserProfileOutput } from "./dtos/user-profile.dto";
import { User } from "./entities/user.entity";
import { UserService } from "./users.service";

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly UserService: UserService) {}

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
  @Query((returns) => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: User) {
    return authUser;
  }

  @Query((returns) => UserProfileOutput)
  @UseGuards(AuthGuard)
  async profile(
    @Args() userProfileInput: UserProfileInput
  ): Promise<UserProfileOutput> {
    try {
      const user = await this.UserService.findById(userProfileInput.userId);
      if (!user) {
        throw Error();
      }
      return {
        ok: true,
        user: user,
      };
    } catch (e) {
      return {
        ok: false,
        error: "User Not Found",
      };
    }
  }
  @Mutation((returns) => EditProfileOutPut)
  @UseGuards(AuthGuard)
  async editProfile(
    @AuthUser() authUser: User,
    @Args("input") editProfileInput: EditProfileInput
  ): Promise<EditProfileOutPut> {
    try {
      await this.UserService.editProfile(authUser.id, editProfileInput);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: e,
      };
    }
  }
}
