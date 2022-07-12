import { ArgsType, Field, InputType, OmitType } from "@nestjs/graphql";
import { IsBoolean, IsString, Length } from "class-validator";
import { Resturant } from "../entities/resturant.entity";

@InputType()
export class CreateResturantDto extends OmitType(
  Resturant,
  ["id"],
  InputType
) {}
