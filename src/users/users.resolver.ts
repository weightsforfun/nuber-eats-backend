import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthGuard } from "src/auth/auth.guard";
import { CreateUserInput, CreateUserOutput } from "./dtos/create-user.dto";
import { EditProfileInput, EditProfileOutPut } from "./dtos/edit-profile.dto";
import { LoginInput, LoginOutput } from "./dtos/login-users.dto";
import { UserProfileInput, UserProfileOutput } from "./dtos/user-profile.dto";
import { VerificationInput, VerificationOutput } from "./dtos/verification.dto";
import { User } from "./entities/user.entity";
import { UserService } from "./users.service";

@Resolver((of) => User)
export class UserResolver {
  constructor(private readonly UserService: UserService) {}

  @Mutation((returns) => CreateUserOutput)
  async createAccount(
    @Args("input") CreateUserInput: CreateUserInput
  ): Promise<CreateUserOutput> {
    return await this.UserService.createAccount(CreateUserInput);
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args("input") LoginInput: LoginInput): Promise<LoginOutput> {
    return this.UserService.login(LoginInput);
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
    return this.UserService.findById(userProfileInput);
  }

  @Mutation((returns) => EditProfileOutPut)
  @UseGuards(AuthGuard)
  async editProfile(
    @AuthUser() authUser: User,
    @Args("input") editProfileInput: EditProfileInput
  ): Promise<EditProfileOutPut> {
    return this.UserService.editProfile(authUser.id, editProfileInput);
  }

  @Mutation((returns) => VerificationOutput)
  async verifyEmail(
    @Args("input") { code }: VerificationInput
  ): Promise<VerificationOutput> {
    return this.UserService.verifyEmail(code);
  }
}
