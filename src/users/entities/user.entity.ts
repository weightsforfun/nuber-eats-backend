import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from "@nestjs/graphql";

import { Core } from "src/common/entites/core.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import * as bcrypt from "bcrypt";
import { InternalServerErrorException } from "@nestjs/common";
import { IsBoolean, IsEmail, IsEnum, IsString } from "class-validator";
import { Restaurant } from "src/restaurant/entities/restaurant.entity";

export enum UserRole {
  Client = "Client",
  Owner = "Owner",
  Delivery = "Delivery",
}
registerEnumType(UserRole, { name: "UserRole" });

@InputType("UserInputType", { isAbstract: true })
@Entity()
@ObjectType()
export class User extends Core {
  @Column({ unique: true })
  @Field((type) => String)
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Field((type) => String)
  @IsString()
  password: string;

  @Column({ type: "enum", enum: UserRole })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field((type) => Boolean)
  @IsBoolean()
  verified: boolean;

  @OneToMany((type) => Restaurant, (restaurant) => restaurant.owner)
  restaurants: Restaurant[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        this.password = await bcrypt.hash(this.password, 10);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkPassword(password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, this.password);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
