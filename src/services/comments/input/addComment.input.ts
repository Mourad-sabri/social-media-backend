import { Field, InputType } from "type-graphql";

@InputType()
export class AddComentInput {
  @Field(() => String)
  post_id: string;

  @Field(() => String)
  comment: string;
}
