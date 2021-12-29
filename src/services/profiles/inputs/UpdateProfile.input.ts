import { Field, ID, InputType, Int, ObjectType } from "type-graphql";

@InputType()
export class UpdateProfileInput {
  @Field(() => String, { nullable: true })
  first_name: string;

  @Field(() => String, { nullable: true })
  last_name: string;

  @Field(() => Int, { nullable: true })
  age: number;

  @Field(() => String, { nullable: true })
  status: string;

  @Field(() => String, { nullable: true })
  gender: string;

  @Field(() => String, { nullable: true })
  job: string;

  @Field(() => String, { nullable: true })
  country: string;

  @Field(() => String, { nullable: true })
  city: string;

  @Field(() => String, { nullable: true })
  contact_email: string;

  @Field(() => String, { nullable: true })
  contact_phone: string;

  @Field(() => String, { nullable: true })
  bio: string;

  @Field(() => String, { nullable: true })
  url: string;
}
