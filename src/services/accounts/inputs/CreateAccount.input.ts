import { IsEmail, IsInt, IsString, MinLength } from "class-validator";
import { Field, InputType, Int } from "type-graphql";
import { IsUserAlreadyExist } from "../../../validators/IsAccountExist";

@InputType()
export class CreateAccountInput {
  @Field(() => String)
  @IsString({ message: "first name must be type of string" })
  first_name: string;

  @Field(() => String)
  @IsString({ message: "last name must be type of string" })
  last_name: string;

  @Field(() => String)
  @IsEmail({ message: "please enter valide email address" })
  email: string;

  @Field(() => String)
  @IsString({ message: "password must be type of string" })
  @MinLength(7, { message: "password should be more than 7" })
  password: string;

  @Field(() => Int)
  @IsInt({ message: "age must be an integer value" })
  age: number;
}
