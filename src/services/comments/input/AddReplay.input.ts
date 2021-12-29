import { Field, InputType } from "type-graphql";

@InputType()
export class AddReplayComentInput {
  @Field(() => String)
  comment_id: string;

  @Field(() => String)
  replay: string;
}
