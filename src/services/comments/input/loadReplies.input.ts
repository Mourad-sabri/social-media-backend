import { Field, InputType, Int } from "type-graphql";

@InputType()
export class LoadRepliesInput {
  @Field(() => Int)
  take: number;

  @Field(() => Int)
  skip: number;
}
