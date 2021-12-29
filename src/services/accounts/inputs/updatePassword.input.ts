import { Field, InputType } from "type-graphql";

@InputType()
export class UpdatePasswordInput {
  @Field(() => String)
  password: string;

  @Field(() => String)
  new_password: string;
}
