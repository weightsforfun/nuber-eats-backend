import { Field, ObjectType } from "@nestjs/graphql";
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
@ObjectType()
export class Core {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: Number;

  @CreateDateColumn()
  @Field((type) => Date)
  createdAt: Date;

  @UpdateDateColumn()
  @Field((type) => Date)
  updatedAt: Date;
}
