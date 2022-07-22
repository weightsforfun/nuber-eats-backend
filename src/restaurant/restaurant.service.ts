import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Repository } from "typeorm";
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from "./dtos/create-restaurant.dto";
import { DeleteRestaurantInput } from "./dtos/delete_restaurant.dto";
import { AllCategoriesOutput } from "./entities/all-categories.dto";
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
  async deleteRestaurant(owner: User, { restaurantId }: DeleteRestaurantInput) {
    try {
      const restaurant = await this.restaurants.findOneBy({ id: restaurantId });
      if (!restaurant) {
        return {
          ok: false,
          error: "Restaurant not found",
        };
      }
      if (owner.id !== restaurant.owner.id) {
        return {
          ok: false,
          error: "You can't delete a restaurant that you don't own",
        };
      }
      await this.restaurants.delete(restaurantId);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: "Could not delete restaurant.",
      };
    }
  }
  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categories.find();
      return {
        ok: true,
        categories,
      };
    } catch {
      return {
        ok: false,
        error: "Could not load categories",
      };
    }
  }
  countRestaurant(category: Category) {
    return this.restaurants.count({ where: { category: { id: category.id } } });
  }
}
