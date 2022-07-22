import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString, Length } from "class-validator";
import { Core } from "src/common/entites/core.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, RelationId } from "typeorm";
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

  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.restaurants, {
    onDelete: "CASCADE",
  })
  owner: User;

  @ManyToOne((type) => Category, (category) => category.restaurants, {
    nullable: true,
    onDelete: "SET NULL",
    eager: true,
  })
  @Field((type) => Category, { nullable: true })
  category: Category;
}
