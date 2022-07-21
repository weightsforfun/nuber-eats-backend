import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString, Length } from "class-validator";
import { Core } from "src/common/entites/core.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Category } from "./category.entity";

@InputType("RestaurantInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends Core {
  @Column()
  @Field((type) => String)
  @IsString()
  @Length(5)
  name: string;

  @Column()
  @Field((type) => String)
  @IsString()
  coverImg: string;

  @Column()
  @Field((type) => String)
  @IsString()
  address?: string;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.restaurants, {
    onDelete: "CASCADE",
  })
  owner: User;

  @ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @Field((type) => Category)
  category: Category;
}
