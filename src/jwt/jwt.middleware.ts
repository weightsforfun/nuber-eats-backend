import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UserService } from "src/users/users.service";
import { JwtService } from "./jwt.service";

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly JwtService: JwtService,
    private readonly UserService: UserService
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if ("x-jwt" in req.headers) {
      const token = req.headers["x-jwt"];
      try {
        const decoded = this.JwtService.verify(token.toString());
        if (typeof decoded === "object" && decoded.hasOwnProperty("id")) {
          const user = await this.UserService.findById(decoded["id"]);
          req["user"] = user;
        }
      } catch {}
    }
    next();
  }
}
