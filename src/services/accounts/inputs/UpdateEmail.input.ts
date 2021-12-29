import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateEmailInput {
  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;
}
