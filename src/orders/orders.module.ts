import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "src/restaurant/entities/category.entity";
import { Dish } from "src/restaurant/entities/dish.entity";
import { Restaurant } from "src/restaurant/entities/restaurant.entity";
import { RestaurantResolver } from "src/restaurant/restaurant.resolver";
import { RestaurantService } from "src/restaurant/restaurant.service";
import { OrderItem } from "./entites/order-item.entity";
import { Order } from "./entites/order.entity";
import { OrderResolver } from "./orders.resolver";
import { OrderService } from "./orders.service";

@Module({
  imports: [TypeOrmModule.forFeature([Order, Restaurant, OrderItem, Dish])],
  providers: [OrderService, OrderResolver],
})
export class OrdersModule {}
