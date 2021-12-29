import { Field, InputType, Int } from "type-graphql";

@InputType()
export class AllCommentsInputs {
  @Field(() => Int)
  take: number;

  @Field(() => Int)
  skip: number;
}
