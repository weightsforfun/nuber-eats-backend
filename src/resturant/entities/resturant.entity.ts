import { Field, ObjectType } from "@nestjs/graphql";
import { IsBoolean, Length } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
@Entity()
export class Resturant {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @Column()
  @Field((type) => String)
  @Length(5)
  name: string;

  @Column({ default: true })
  @Field((type) => Boolean, { nullable: true })
  @IsBoolean()
  isVegan?: boolean;

  @Column()
  @Field((type) => String)
  address?: string;

  @Column()
  @Field((type) => String, { defaultValue: "과천" })
  ownerName?: string;

  @Column()
  @Field((type) => String)
  categoryName?: string;
}
