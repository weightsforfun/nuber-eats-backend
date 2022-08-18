import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Verification } from "../entities/verification.entity";

@InputType()
export class VerificationInput extends PickType(Verification, ["code"]) {}

@ObjectType()
export class VerificationOutput extends CoreOutput {}
