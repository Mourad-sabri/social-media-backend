import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";

import { ApolloContext } from "../../../types/ApolloContext";
import { CommentRepo } from "../../comments/repositories/CommentRepo";
import { ProfileRepo } from "../../profiles/repositories/ProfileRepo";
import { CommentLikesRepo } from "../repositories/CommentsLikeRepo";

@Service()
@Resolver()
export class LikeCommentResolver {
  @InjectRepository(CommentRepo)
  private readonly comments: CommentRepo;

  @InjectRepository(ProfileRepo)
  private readonly accountProfile: ProfileRepo;

  @InjectRepository(CommentLikesRepo)
  private readonly commentLikes: CommentLikesRepo;

  @Mutation(() => Boolean)
  async likeComment(@Arg("comment_id") comment_id: string, @Ctx() ctx: ApolloContext): Promise<boolean> {
    const comment = await this.comments.findOne({ where: { comment_id } });
    const profile = await this.accountProfile.loadProfile(ctx.profile_id);
    if (!comment || !profile) throw new Error("oppes something went wrong please try again !");
    return await this.commentLikes.likeComment(comment, profile);
  }

  @Mutation(() => Boolean)
  async unlikeComment(@Arg("comment_like_id") comment_like_id: string, @Ctx() ctx: ApolloContext): Promise<boolean> {
    return await this.commentLikes.unlikeComment(comment_like_id, ctx.profile_id);
  }
}
