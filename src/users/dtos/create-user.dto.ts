import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { UserAccount } from "../entities/user.entity";

@InputType()
export class CreateUserInput extends PickType(UserAccount, [
  "email",
  "password",
  "role",
]) {}

@ObjectType()
export class CreateUserOutput {
  @Field((type) => String, { nullable: true })
  error?: string;

  @Field((type) => Boolean)
  ok: boolean;
}
