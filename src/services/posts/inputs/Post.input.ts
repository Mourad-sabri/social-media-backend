import { IsString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class PostInput {
  @Field(() => String, { nullable: true })
  @IsString({ message: "content should be string" })
  content: string;

  @Field(() => String, { nullable: true })
  @IsString({ message: "media type should be string" })
  media_type: string;

  @Field(() => String, { nullable: true })
  @IsString({ message: "media url should be string" })
  media_url: string;
}
