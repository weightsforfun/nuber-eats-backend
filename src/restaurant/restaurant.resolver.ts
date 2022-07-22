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
import { User } from "src/users/entities/user.entity";
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from "./dtos/create-restaurant.dto";
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from "./dtos/delete_restaurant.dto";
import { AllCategoriesOutput } from "./entities/all-categories.dto";
import { Category } from "./entities/category.entity";
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
}
