import { Field, InputType } from "type-graphql";

@InputType()
export class UpdateReplayComentInput {
  @Field(() => String)
  replay_id: string;

  @Field(() => String)
  replay: string;
}
