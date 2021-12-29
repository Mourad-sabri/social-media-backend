import { Arg, Ctx, FieldResolver, Int, Mutation, Resolver, Root } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import * as _ from "lodash";
import { Service } from "typedi";

import { ApolloContext } from "../../../types/ApolloContext";
import { PostRepo } from "../../posts/repositories/PostRepo";
import { ProfileRepo } from "../../profiles/repositories/ProfileRepo";
import { Comment } from "../entities/Comment";
import { ReplayComment } from "../entities/ReplayComment";
import { AddComentInput } from "../input/addComment.input";
import { UpdateCommentInput } from "../input/updateComment.input";
import { CommentReplayRepo } from "../repositories/CommentReplayRepo";
import { CommentRepo } from "../repositories/CommentRepo";
import { safeCompare } from "../../../helpers/safeCompare";
import { LoadRepliesInput } from "../input/loadReplies.input";
import { CommentLikesRepo } from "../../likes/repositories/CommentsLikeRepo";
import { CommentsLikes } from "../../likes/entities/CommentsLikes";
import { Profile } from "../../profiles/entities/Profile";

@Service()
@Resolver(Comment)
export class CommentResolver {
  @InjectRepository(PostRepo)
  private readonly post: PostRepo;

  @InjectRepository(CommentRepo)
  private readonly comment: CommentRepo;

  @InjectRepository(ProfileRepo)
  private readonly accountProfile: ProfileRepo;

  @InjectRepository(CommentReplayRepo)
  private readonly replay: CommentReplayRepo;

  @InjectRepository(CommentLikesRepo)
  private readonly commentLikes: CommentLikesRepo;

  @Mutation(() => Comment)
  async addComment(@Arg("data") data: AddComentInput, @Ctx() { profile_id }: ApolloContext): Promise<Comment> {
    const profile = await this.accountProfile.loadProfile(profile_id);
    const post = await this.post.findPost(data.post_id);
    const comment = await this.comment.createComment(data.comment, profile!, post!);
    return comment;
  }
  @Mutation(() => Boolean)
  async deleteComment(@Arg("comment_id") comment_id: string, @Ctx() { profile_id }: ApolloContext): Promise<boolean> {
    return await this.comment.deleteComment(comment_id, profile_id);
  }

  @Mutation(() => Comment)
  async updateComment(@Arg("data") data: UpdateCommentInput, @Ctx() ctx: ApolloContext): Promise<Comment> {
    const comment = await this.comment.updateComment(data.comment_id, ctx.profile_id, data.comment);
    return comment;
  }

  @FieldResolver(() => Boolean)
  async isAdmin(@Root() parent: Comment, @Ctx() ctx: ApolloContext): Promise<boolean> {
    return safeCompare(parent.profile_id, ctx.profile_id);
  }

  @FieldResolver(() => [ReplayComment])
  async replies(@Root() p: Comment, @Arg("data") d: LoadRepliesInput, @Ctx() ctx: ApolloContext): Promise<ReplayComment[]> {
    const replies = await this.replay.loadReplies(p.comment_id, d.take, d.skip);
    return replies;
  }

  @FieldResolver(() => Int)
  async comment_likes_count(@Root() parent: Comment): Promise<number> {
    return await this.commentLikes.countCommentLikes(parent.comment_id);
  }

  @FieldResolver(() => Boolean)
  async isLiked(@Root() parent: Comment, @Ctx() ctx: ApolloContext): Promise<boolean> {
    const isLiked = await this.commentLikes.findOne({
      where: { comment_id: parent.comment_id, profile_id: ctx.profile_id },
    });
    return Boolean(isLiked);
  }

  @FieldResolver(() => [CommentsLikes])
  async comments_likes(@Root() p: Comment, @Arg("take") take: number, @Arg("skip") skip: number): Promise<CommentsLikes[]> {
    return await this.commentLikes.find({ where: { comment_id: p.comment_id }, take, skip });
  }

  @FieldResolver(() => Profile, { nullable: true })
  async profile(@Root() p: Comment): Promise<Profile | undefined> {
    return await this.accountProfile.loadProfile(p.profile_id);
  }
}
