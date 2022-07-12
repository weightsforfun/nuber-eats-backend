import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateResturantDto } from "./dtos/create-resturant.dto";
import { UpdateResturantDto } from "./dtos/update-resturant.dto";
import { Resturant } from "./entities/resturant.entity";

@Injectable()
export class ResturantService {
  constructor(
    @InjectRepository(Resturant)
    private resturants: Repository<Resturant>
  ) {}
  getAll(): Promise<Resturant[]> {
    return this.resturants.find();
  }
  createResturant(CreateResturantDto: CreateResturantDto): Promise<Resturant> {
    const newResturant = this.resturants.create(CreateResturantDto);
    return this.resturants.save(newResturant);
  }
  updateResturant({ id, data }: UpdateResturantDto) {
    return this.resturants.update(id, { ...data });
  }
}
