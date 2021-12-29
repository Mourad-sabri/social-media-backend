import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import * as _ from "lodash";

import { ProfileRepo } from "../repositories/ProfileRepo";
import { ApolloContext } from "../../../types/ApolloContext";
import { Profile } from "../entities/Profile";
import { UpdateProfileInput } from "../inputs/UpdateProfile.input";
import { safeCompare } from "../../../helpers/safeCompare";

@Service()
@Resolver()
export class ProfileResolver {
  @InjectRepository(ProfileRepo)
  private readonly profile: ProfileRepo;

  @Query(() => Profile)
  async accountProfile(@Ctx() { profile_id }: ApolloContext): Promise<Profile> {
    const profile = await this.profile.loadProfile(profile_id);
    if (!profile) throw new Error("something went wrong please try again !!!");
    return _.assign(profile, { isAdmin: true });
  }

  @Query(() => Profile)
  async findProfile(@Arg("profile_id") profile_id: string, @Ctx() ctx: ApolloContext): Promise<Profile> {
    const profile = await this.profile.loadProfile(profile_id);
    if (!profile) throw new Error("we couldn't find this profile please try again later or report it to our team");
    return _.assign(profile, { isAdmin: safeCompare(profile_id, ctx.profile_id) });
  }

  @Mutation(() => Profile)
  async updateProfile(@Arg("data") data: UpdateProfileInput, @Ctx() ctx: ApolloContext): Promise<Partial<Profile>> {
    const profile = await this.profile.updateProfile(data, ctx.profile_id);
    if (!profile) throw new Error("someting went wrong please try again");
    return _.assign(profile, { isAdmin: true });
  }
}
