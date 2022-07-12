import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from "@nestjs/graphql";

import { Core } from "src/common/entites/core.entity";
import { Column, Entity } from "typeorm";

enum UserRole {
  client,
  owner,
  delivery,
}
registerEnumType(UserRole, { name: "UserRole" });
@InputType({ isAbstract: true })
@Entity()
@ObjectType()
export class UserAccount extends Core {
  @Column()
  @Field((type) => String)
  email: string;

  @Column()
  @Field((type) => String)
  password: string;

  @Column({ type: "enum", enum: UserRole })
  @Field((type) => UserRole)
  role: UserRole;
}
