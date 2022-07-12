import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserAccount } from "./entities/user.entity";
import { UserResolver } from "./users.resolver";
import { UserService } from "./users.service";

@Module({
  imports: [TypeOrmModule.forFeature([UserAccount])],
  providers: [UserResolver, UserService],
})
export class UsersModule {}
