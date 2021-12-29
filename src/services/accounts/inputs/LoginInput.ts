import { Field, InputType } from "type-graphql";

@InputType()
export class LoginInput {
  @Field(() => String)
  password: string;

  @Field(() => String)
  email: string;
}
