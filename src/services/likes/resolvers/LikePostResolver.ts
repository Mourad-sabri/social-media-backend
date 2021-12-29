import { Arg, Ctx, FieldResolver, Mutation, Resolver, Root } from "type-graphql";
import { Service } from "typedi";
import * as _ from "lodash";

import { InjectRepository } from "typeorm-typedi-extensions";
import { safeCompare } from "../../../helpers/safeCompare";
import { ApolloContext } from "../../../types/ApolloContext";
import { PostRepo } from "../../posts/repositories/PostRepo";
import { Profile } from "../../profiles/entities/Profile";
import { ProfileRepo } from "../../profiles/repositories/ProfileRepo";
import { PostLike } from "../entities/PostLike";
import { PostLikeRepo } from "../repositories/PostLikeRepo";

@Service()
@Resolver(PostLike)
export class PostLikesResolver {
  @InjectRepository(PostRepo)
  private readonly post: PostRepo;

  @InjectRepository(ProfileRepo)
  private readonly accountProfile: ProfileRepo;

  @InjectRepository(PostLikeRepo)
  private readonly like: PostLikeRepo;

  @Mutation(() => Boolean)
  async likePost(@Arg("post_id") post_id: string, @Ctx() { profile_id }: ApolloContext): Promise<boolean> {
    const profile = await this.accountProfile.loadProfile(profile_id);
    const post = await this.post.findPost(post_id);
    if (!profile || !post) throw new Error("something went wrong please try again");
    return await this.like.likePost(post, profile);
  }

  @Mutation(() => Boolean)
  async unlikePost(@Arg("post_like_id") post_like_id: string, @Ctx() ctx: ApolloContext): Promise<boolean> {
    return await this.like.unlikePost(post_like_id, ctx.profile_id);
  }

  @FieldResolver(() => Profile, { nullable: true })
  async profile(@Root() p: PostLike, @Ctx() ctx: ApolloContext): Promise<Profile | null> {
    const profile = await this.accountProfile.loadProfile(p.profile_id);
    if (!profile) return null;
    return _.assign(profile, { isAdmin: safeCompare(p.profile_id, ctx.profile_id) });
  }
}
