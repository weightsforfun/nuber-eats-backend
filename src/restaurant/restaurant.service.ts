import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from "./dtos/create-restaurant.dto";
import { Category } from "./entities/category.entity";
import { Restaurant } from "./entities/restaurant.entity";

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurants: Repository<Restaurant>,

    @InjectRepository(Category)
    private categories: Repository<Category>
  ) {}
  async createRestaurant(
    owner: User,
    CreateRestaurantInput: CreateRestaurantInput
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurants.create(CreateRestaurantInput);
      newRestaurant.owner = owner;
      const categoryName = CreateRestaurantInput.categoryName
        .trim()
        .toLowerCase();
      const categorySlug = categoryName.replace(/ /g, "-");
      let category = await this.categories.findOne({ where: { categorySlug } });
      if (!category) {
        category = await this.categories.save(
          this.categories.create({ categorySlug, name: categoryName })
        );
      }
      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: "could not create restaurant",
      };
    }
  }
}
