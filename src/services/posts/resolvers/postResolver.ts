import { Arg, Ctx, FieldResolver, Int, Mutation, Query, Resolver, Root } from "type-graphql";
import { Service } from "typedi";
import * as _ from "lodash";

import { InjectRepository } from "typeorm-typedi-extensions";
import { ApolloContext } from "../../../types/ApolloContext";
import { ProfileRepo } from "../../profiles/repositories/ProfileRepo";
import { PostInput } from "../inputs/Post.input";
import { PostRepo } from "../repositories/PostRepo";
import { Post } from "../entities/Post";
import { safeCompare } from "../../../helpers/safeCompare";
import { Profile } from "../../profiles/entities/Profile";
import { Comment } from "../../comments/entities/Comment";
import { CommentRepo } from "../../comments/repositories/CommentRepo";
import { AllCommentsInputs } from "../inputs/loadComments.inputs";
import { PostLikeRepo } from "../../likes/repositories/PostLikeRepo";
import { PostLike } from "../../likes/entities/PostLike";
import { v4 } from "uuid";

@Service()
@Resolver(Post)
export class PostResolver {
  @InjectRepository(PostRepo)
  private readonly post: PostRepo;

  @InjectRepository(ProfileRepo)
  private readonly accountProfile: ProfileRepo;

  @InjectRepository(CommentRepo)
  private readonly comment: CommentRepo;

  @InjectRepository(PostLikeRepo)
  private readonly like: PostLikeRepo;

  @Mutation(() => Post)
  async addPost(@Arg("data") data: PostInput, @Ctx() { profile_id }: ApolloContext): Promise<Post> {
    const profile = await this.accountProfile.loadProfile(profile_id);
    if (!profile) throw new Error("could not create post please try again");
    const post = await this.post.createPost({ ...data, profile, profile_id });
    if (!post) throw new Error("could not create post please try again");
    return post;
  }

  @Mutation(() => Post)
  async updatePost(@Arg("data") data: PostInput, @Arg("post_id") post_id: string, @Ctx() ctx: ApolloContext): Promise<Post> {
    const post = await this.post.updatePost(data, post_id, ctx.profile_id);
    if (!post) throw new Error("could not update your post please try again !!!");
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg("post_id") post_id: string, @Ctx() { profile_id }: ApolloContext): Promise<boolean> {
    return await this.post.removePost(post_id, profile_id);
  }

  @Query(() => [Post])
  async allPosts(@Arg("take") take: number, @Arg("skip") skip: number, @Ctx() ctx: ApolloContext): Promise<Post[]> {
    const posts = await this.post.findAllPost(take, skip);
    if (posts.length < 1) return posts;
    return posts;
  }

  @Query(() => [Post])
  async allProfilePosts(@Arg("take") take: number, @Arg("skip") skip: number, @Ctx() ctx: ApolloContext): Promise<Post[]> {
    const posts = await this.post.findProfilePosts(ctx.profile_id, take, skip);
    if (posts.length < 1) return posts;
    return posts;
  }

  @Query(() => Post)
  async getPost(@Arg("post_id") post_id: string, @Ctx() ctx: ApolloContext): Promise<Post> {
    const post = await this.post.findPost(post_id);
    return post;
  }

  @FieldResolver(() => Profile, { nullable: true })
  async profile(@Root() parent: Post, @Ctx() { profile_id }: ApolloContext): Promise<Profile | null> {
    const profile = await this.accountProfile.loadProfile(parent.profile_id);
    if (!profile) return null;
    return profile;
  }

  @FieldResolver(() => Comment)
  async comments(@Root() parent: Post, @Arg("data") data: AllCommentsInputs, @Ctx() ctx: ApolloContext): Promise<Comment[]> {
    const comments = await this.comment.loadComments(parent.post_id, data.take, data.skip);
    return comments;
  }

  @FieldResolver(() => Number)
  async post_likes_count(@Root() parent: Post): Promise<number> {
    return await this.like.countPostLikes(parent.post_id);
  }

  @FieldResolver(() => [PostLike])
  async post_likes(@Root() parent: Post, @Arg("take") take: number, @Arg("skip") skip: number): Promise<PostLike[]> {
    return await this.like.loadLikes(parent.post_id, take, skip);
  }

  @FieldResolver(() => Boolean)
  async isLiked(@Root() parent: Post, @Ctx() ctx: ApolloContext): Promise<boolean> {
    const isExist = await this.like.findOne({ where: { profile_id: ctx.profile_id, post_id: parent.post_id } });
    if (isExist) return true;
    return false;
  }

  @FieldResolver(() => Boolean)
  async isAdmin(@Root() parent: Post, @Ctx() ctx: ApolloContext): Promise<boolean> {
    return safeCompare(parent.profile_id, ctx.profile_id);
  }

  @FieldResolver(() => Int)
  async comments_count(@Root() parent: Post, @Ctx() ctx: ApolloContext): Promise<number> {
    const post = await this.comment.findAndCount({ post_id: parent.post_id });
    return post[1];
  }

  @FieldResolver(() => Int)
  async share_count(): Promise<number> {
    return 10;
  }
}
