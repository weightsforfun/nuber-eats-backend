import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Core } from "src/common/entites/core.entity";
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { User } from "./user.entity";
import { v4 as uuidv4 } from "uuid";
@InputType({ isAbstract: true })
@Entity()
@ObjectType()
export class Verification extends Core {
  @Column()
  @Field((type) => String)
  code: string;

  @OneToOne((type) => User, { onDelete: "CASCADE" })
  @JoinColumn()
  user: User;

  @Column()
  userId: number;

  @BeforeInsert()
  @BeforeUpdate()
  createCode(): void {
    this.code = uuidv4();
  }

  changeCode(): string {
    return uuidv4();
  }
}
