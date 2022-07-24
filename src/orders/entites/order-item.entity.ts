import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Core } from "src/common/entites/core.entity";

import { Dish, DishOption } from "src/restaurant/entities/dish.entity";

import { Column, Entity, ManyToOne } from "typeorm";

@InputType("OrderItemInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends Core {
  @Field((type) => Dish)
  @ManyToOne((type) => Dish, { nullable: true, onDelete: "CASCADE" })
  dish: Dish;

  @Field((type) => [DishOption], { nullable: true })
  @Column({ type: "json", nullable: true })
  options?: DishOption[];
}
