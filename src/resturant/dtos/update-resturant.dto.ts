import { ArgsType, Field, InputType, PartialType } from "@nestjs/graphql";

import { CreateResturantDto } from "./create-resturant.dto";

@InputType()
export class UpdateResturantInput extends PartialType(CreateResturantDto) {}

@ArgsType()
export class UpdateResturantDto {
  @Field((type) => Number)
  id: number;

  @Field((type) => UpdateResturantInput)
  data: UpdateResturantInput;
}
