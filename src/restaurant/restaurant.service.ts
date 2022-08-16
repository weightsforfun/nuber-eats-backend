import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import {
  CategoryInput,
  CategoryOutput,
} from "src/restaurant/dtos/category.dto";
import {
  CreateDishInput,
  CreateDishOutput,
} from "src/users/dtos/create-dish.dto";
import {
  DeleteDishInput,
  DeleteDishOutput,
} from "src/users/dtos/delete-dish.dto";
import { EditDishInput, EditDishOutput } from "src/users/dtos/edit-dish.dto";
import { User } from "src/users/entities/user.entity";
import { ILike, Like, Repository } from "typeorm";
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from "./dtos/create-restaurant.dto";
import { DeleteRestaurantInput } from "./dtos/delete_restaurant.dto";
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from "./dtos/edit-restaurant.dto";
import { MyRestaurantsOutput } from "./dtos/my-restaurants.dto";
import { RestaurantInput, RestaurantOutput } from "./dtos/restaurant.dto";
import { RestaurantsInput, RestaurantsOutput } from "./dtos/restaurants.dto";
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from "./dtos/search-restaurant.dto";
import { AllCategoriesOutput } from "./entities/all-categories.dto";
import { Category } from "./entities/category.entity";
import { Dish } from "./entities/dish.entity";

import { Restaurant } from "./entities/restaurant.entity";

@Injectable()
export class RestaurantService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurants: Repository<Restaurant>,

    @InjectRepository(Category)
    private categories: Repository<Category>,

    @InjectRepository(Dish)
    private dishes: Repository<Dish>
  ) {}
  async getOrCreate(name: string): Promise<Category> {
    const categoryName = name.trim().toLowerCase();
    const categorySlug = categoryName.replace(/ /g, "-");
    let category = await this.categories.findOne({ where: { categorySlug } });
    if (!category) {
      category = await this.categories.save(
        this.categories.create({ categorySlug, name: categoryName })
      );
    }
    return category;
  }
  async createRestaurant(
    owner: User,
    CreateRestaurantInput: CreateRestaurantInput
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurants.create(CreateRestaurantInput);
      newRestaurant.owner = owner;
      newRestaurant.category = await this.getOrCreate(
        CreateRestaurantInput.categoryName
      );
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
  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurantInput
  ): Promise<EditRestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        where: { id: editRestaurantInput.restaurantId },
      });
      if (!restaurant) {
        return {
          ok: false,
          error: "Restaurant not found",
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: "You can't edit a restaurant that you don't own",
        };
      }

      let category: Category = null;
      if (editRestaurantInput.categoryName) {
        category = await this.getOrCreate(editRestaurantInput.categoryName);
      }
      await this.restaurants.save([
        {
          id: editRestaurantInput.restaurantId,
          ...editRestaurantInput,
          ...(category && { category }),
        },
      ]);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: "Could not edit Restaurant",
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
  async findCategoryBySlug({
    slug,
    page,
  }: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categories.findOne({
        where: { categorySlug: slug },
      });
      if (!category) {
        return {
          ok: false,
          error: "Category not found",
        };
      }
      const restaurants = await this.restaurants.find({
        where: {
          category: { id: category.id },
        },
        order: {
          isPromoted: "DESC",
        },
        take: 3,
        skip: (page - 1) * 3,
      });
      const totalResults = await this.countRestaurant(category);
      return {
        ok: true,
        category,
        restaurants,
        totalPages: Math.ceil(totalResults / 3),
      };
    } catch {
      return {
        ok: false,
        error: "Could not load category",
      };
    }
  }
  async allRestaurants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
    try {
      const [restaurants, totalResults] = await this.restaurants.findAndCount({
        skip: (page - 1) * 3,
        take: 3,
        order: {
          isPromoted: "DESC",
        },
      });
      return {
        ok: true,
        results: restaurants,
        totalPages: Math.ceil(totalResults / 3),
        totalResults,
      };
    } catch {
      return {
        ok: false,
        error: "Could not load restaurants",
      };
    }
  }
  async findRestaurantById({
    restaurantId,
  }: RestaurantInput): Promise<RestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        where: { id: restaurantId },
        relations: ["menu"],
      });
      if (!restaurant) {
        return {
          ok: false,
          error: "Restaurant not found",
        };
      }
      return {
        ok: true,
        restaurant,
      };
    } catch {
      return {
        ok: false,
        error: "Could not find restaurant",
      };
    }
  }
  async searchRestaurantByName({
    query,
    page,
  }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    try {
      const [restaurants, totalResults] = await this.restaurants.findAndCount({
        where: {
          name: ILike(`%${query}%`),
        },
        skip: (page - 1) * 3,
        take: 3,
      });
      return {
        ok: true,
        restaurants,
        totalResults,
        totalPages: Math.ceil(totalResults / 3),
      };
    } catch {
      return { ok: false, error: "Could not search for restaurants" };
    }
  }
  async createDish(
    owner: User,
    createDishInput: CreateDishInput
  ): Promise<CreateDishOutput> {
    try {
      const restaurant = await this.restaurants.findOne({
        where: { id: createDishInput.restaurantId },
      });
      if (!restaurant) {
        return {
          ok: false,
          error: "Restaurant not found",
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: "You can't do that.",
        };
      }
      await this.dishes.save(
        this.dishes.create({ ...createDishInput, restaurant })
      );
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: "Could not create dish",
      };
    }
  }
  async editDish(
    owner: User,
    editDishInput: EditDishInput
  ): Promise<EditDishOutput> {
    try {
      const dish = await this.dishes.findOne({
        where: { id: editDishInput.dishId },
        relations: ["restaurant"],
      });
      if (!dish) {
        return {
          ok: false,
          error: "Dish not found",
        };
      }
      if (dish.restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: "You can't do that.",
        };
      }
      await this.dishes.save([
        {
          id: editDishInput.dishId,
          ...editDishInput,
        },
      ]);

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async deleteDish(
    owner: User,
    { dishId }: DeleteDishInput
  ): Promise<DeleteDishOutput> {
    try {
      const dish = await this.dishes.findOne({
        where: { id: dishId },
        relations: ["restaurant"],
      });
      if (!dish) {
        return {
          ok: false,
          error: "Dish not found",
        };
      }
      if (dish.restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: "You can't do that.",
        };
      }
      await this.dishes.delete(dishId);
      return {
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: "Could not delete dish",
      };
    }
  }
  async myRestaurants(owner: User): Promise<MyRestaurantsOutput> {
    try {
      const restaurants = await this.restaurants.find({
        where: { ownerId: owner.id },
      });
      return {
        restaurants,
        ok: true,
      };
    } catch {
      return {
        ok: false,
        error: "Could not find restaurants.",
      };
    }
  }
}
