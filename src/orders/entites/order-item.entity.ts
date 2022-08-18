import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Core } from "src/common/entites/core.entity";

import { Dish, DishOption } from "src/restaurant/entities/dish.entity";

import { Column, Entity, ManyToOne } from "typeorm";

@InputType("OrderItemOptionInputType", { isAbstract: true })
@ObjectType()
export class OrderItemOption {
  @Field((type) => String)
  name: string;
  @Field((type) => String, { nullable: true })
  choice: String;
}

@InputType("OrderItemInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends Core {
  @Field((type) => Dish)
  @ManyToOne((type) => Dish, { nullable: true, onDelete: "CASCADE" })
  dish: Dish;

  @Field((type) => [OrderItemOption], { nullable: true })
  @Column({ type: "json", nullable: true })
  options?: OrderItemOption[];
}
