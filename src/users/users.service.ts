import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserInput } from "./dtos/create-user.dto";
import { LoginInput } from "./dtos/login-users.dto";
import { User } from "./entities/user.entity";
import { JwtService } from "src/jwt/jwt.service";
import { EditProfileInput, EditProfileOutPut } from "./dtos/edit-profile.dto";
import { Verification } from "./entities/verification.entity";
import { UserProfileInput, UserProfileOutput } from "./dtos/user-profile.dto";
import { VerificationOutput } from "./dtos/verification.dto";
import { MailService } from "src/mail/mail.service";
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwt: JwtService,
    private readonly mailService: MailService
  ) {}
  async createAccount({
    email,
    password,
    role,
  }: CreateUserInput): Promise<{ ok: boolean; error?: string }> {
    try {
      const exist = await this.users.findOne({ where: { email } });
      console.log(exist);
      if (exist) {
        return { ok: false, error: "this email is already used" };
      }
      const user = await this.users.save(
        this.users.create({ email, password, role })
      );
      const verification = await this.verifications.save(
        this.verifications.create({ user })
      );
      this.mailService.sendVerificationEmail(user.email, verification.code);
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
      const targetUser = await this.users.findOne({
        where: { email },
        select: ["password", "id"],
      });
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
        error: "Can't log user in.",
      };
    }
  }

  async findById(
    userProfileInput: UserProfileInput
  ): Promise<UserProfileOutput> {
    try {
      const id = userProfileInput.userId;
      const user = await this.users.findOneOrFail({ where: { id } });
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error: "User Not Found",
      };
    }
  }

  // async profile(
  //   userProfileInput: UserProfileInput
  // ): Promise<UserProfileOutput> {
  //   try {
  //       const user = await this.findOneOrFail({where:{userProfileInput.userId}});

  //     return {
  //       ok: true,
  //       user: user.user,
  //     };
  //   } catch (error) {
  //     return {
  //       ok: false,
  //       error: "User Not found",
  //     };
  //   }
  // }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput
  ): Promise<EditProfileOutPut> {
    try {
      const user = await this.users.findOneBy({ id: userId });
      if (email) {
        user.email = email;
        user.verified = false;

        const verify = await this.verifications.findOne({ where: { userId } });
        // verify.code = verify.changeCode(); -test할때 오류난다 어떻게 해결해야할까.

        const updatedVerification = await this.verifications.save(verify);

        this.mailService.sendVerificationEmail(
          user.email,
          updatedVerification.code
        );
      }
      if (password) {
        user.password = password;
      }
      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: "Could not update profile.",
      };
    }
  }

  async verifyEmail(code: string): Promise<VerificationOutput> {
    try {
      const verification = await this.verifications.findOne({
        where: { code },
        relations: ["user"],
      });
      // console.log(verification.user);
      if (verification) {
        verification.user.verified = true;
        await this.users.save(verification.user);
        await this.verifications.delete(verification.id);
        return {
          ok: true,
        };
      }
      return { ok: false, error: "Verification not found." };
    } catch (error) {
      return {
        ok: false,
        error: "Could not verify email.",
      };
    }
  }
}
