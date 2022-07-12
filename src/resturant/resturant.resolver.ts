import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CreateResturantDto } from "./dtos/create-resturant.dto";
import { UpdateResturantDto } from "./dtos/update-resturant.dto";
import { Resturant } from "./entities/resturant.entity";
import { ResturantService } from "./resturant.service";

@Resolver()
export class ResturantResolver {
  constructor(private readonly resturantService: ResturantService) {}
  @Query(() => [Resturant])
  resturants(@Args("veganOnly") veganOnly: boolean): Resturant[] {
    return [];
  }
  @Mutation(() => Boolean)
  async createResturant(
    @Args("input") CreateResturantDto: CreateResturantDto
  ): Promise<boolean> {
    try {
      await this.resturantService.createResturant(CreateResturantDto);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  @Mutation((returns) => Boolean)
  async updateResturant(
    @Args() UpdateResturantDto: UpdateResturantDto
  ): Promise<boolean> {
    try {
      await this.resturantService.updateResturant(UpdateResturantDto);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
