import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { AuthUser } from "src/auth/auth-user.decorator";
import { Role } from "src/auth/role.decorator";
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
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from "./dtos/create-restaurant.dto";
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from "./dtos/delete_restaurant.dto";
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
import { RestaurantService } from "./restaurant.service";

@Resolver((of) => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}
  @Mutation(() => CreateRestaurantOutput)
  @Role(["Owner"])
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args("input") CreateRestaurantInput: CreateRestaurantInput
  ): Promise<CreateRestaurantOutput> {
    return await this.restaurantService.createRestaurant(
      authUser,
      CreateRestaurantInput
    );
  }

  @Mutation(() => DeleteRestaurantOutput)
  @Role(["Owner"])
  async deleteRestaurant(
    @AuthUser() authUser: User,
    @Args("input") DeleteRestaurantInput: DeleteRestaurantInput
  ): Promise<DeleteRestaurantOutput> {
    return await this.deleteRestaurant(authUser, DeleteRestaurantInput);
  }
}

@Resolver((of) => Category)
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ResolveField((type) => Number)
  restaturantCount(@Parent() category: Category): Promise<number> {
    return this.restaurantService.countRestaurant(category);
  }

  @Query((type) => AllCategoriesOutput)
  async allCategories(): Promise<AllCategoriesOutput> {
    return this.restaurantService.allCategories();
  }
  @Query((type) => CategoryOutput)
  category(
    @Args("input") categoryInput: CategoryInput
  ): Promise<CategoryOutput> {
    return this.restaurantService.findCategoryBySlug(categoryInput);
  }
  @Query((returns) => RestaurantsOutput)
  restaurants(
    @Args("input") restaurantsInput: RestaurantsInput
  ): Promise<RestaurantsOutput> {
    return this.restaurantService.allRestaurants(restaurantsInput);
  }
  @Query((returns) => RestaurantOutput)
  restaurant(
    @Args("input") restaurantInput: RestaurantInput
  ): Promise<RestaurantOutput> {
    return this.restaurantService.findRestaurantById(restaurantInput);
  }
  @Query((returns) => SearchRestaurantOutput)
  searchRestaurant(
    @Args("input") searchRestaurantInput: SearchRestaurantInput
  ): Promise<SearchRestaurantOutput> {
    return this.restaurantService.searchRestaurantByName(searchRestaurantInput);
  }
}
@Resolver((of) => Dish)
export class DishResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation((type) => CreateDishOutput)
  @Role(["Owner"])
  createDish(
    @AuthUser() owner: User,
    @Args("input") createDishInput: CreateDishInput
  ): Promise<CreateDishOutput> {
    return this.restaurantService.createDish(owner, createDishInput);
  }
  @Mutation((type) => EditDishOutput)
  @Role(["Owner"])
  editDish(
    @AuthUser() owner: User,
    @Args("input") editDishInput: EditDishInput
  ): Promise<EditDishOutput> {
    return this.restaurantService.editDish(owner, editDishInput);
  }

  @Mutation((type) => DeleteDishOutput)
  @Role(["Owner"])
  deleteDish(
    @AuthUser() owner: User,
    @Args("input") deleteDishInput: DeleteDishInput
  ): Promise<DeleteDishOutput> {
    return this.restaurantService.deleteDish(owner, deleteDishInput);
  }
}
