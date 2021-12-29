import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateCommentInput {
  @Field(() => String)
  comment_id: string;

  @Field(() => String)
  comment: string;
}
