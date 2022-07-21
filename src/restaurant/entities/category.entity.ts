import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsString } from "class-validator";
import { Core } from "src/common/entites/core.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Restaurant } from "./restaurant.entity";

@InputType("CategoryInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends Core {
  @Column({ unique: true })
  @Field((type) => String)
  @IsString()
  name: string;

  @Field((type) => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  coverImg: string;

  @Field((type) => String)
  @Column({ unique: true })
  @IsString()
  categorySlug: string;

  @Field((type) => [Restaurant])
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.category)
  restaurants: Restaurant[];
}
