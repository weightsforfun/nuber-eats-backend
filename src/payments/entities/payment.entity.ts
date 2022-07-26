import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Core } from "src/common/entites/core.entity";

import { Restaurant } from "src/restaurant/entities/restaurant.entity";

import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";

@InputType("PaymentInputType", { isAbstract: true })
@ObjectType()
@Entity()
export class Payment extends Core {
  @Field((type) => String)
  @Column()
  transactionId: string;

  @Field((type) => User)
  @ManyToOne((type) => User, (user) => user.payments)
  @JoinColumn({ name: "userId" })
  user: User;

  @Column()
  userId: number;

  @Field((type) => Restaurant)
  @ManyToOne((type) => Restaurant)
  restaurant: Restaurant;

  @Field((type) => Int)
  @RelationId((payment: Payment) => payment.restaurant)
  restaurantId: number;
}
