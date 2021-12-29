import { EntityRepository, Repository } from "typeorm";

import { Post } from "../../posts/entities/Post";
import { Profile } from "../../profiles/entities/Profile";
import { PostLike } from "../entities/PostLike";

@EntityRepository(PostLike)
export class PostLikeRepo extends Repository<PostLike> {
  async likePost(post: Post, profile: Profile): Promise<boolean> {
    const isLiked = await this.findOne({ where: { post_id: post.post_id, profile_id: profile.profile_id } });
    if (isLiked) throw new Error("you already like this post");
    const like = await this.save(this.create({ post, profile, post_id: post.post_id, profile_id: profile.profile_id }));
    if (!like) throw new Error("oppes, something went wrong please try again");
    return true;
  }

  async unlikePost(post_like_id: string, profile_id: string): Promise<boolean> {
    const like = await this.findOne({ where: { post_like_id, profile_id } });
    if (!like) throw new Error("something went wrong please try again");
    await this.remove(like);
    return true;
  }

  async countPostLikes(post_id: string): Promise<number> {
    const posts = await this.findAndCount({ where: { post_id } });
    return posts[1];
  }

  async loadLikes(post_id: string, take: number, skip: number): Promise<PostLike[]> {
    return await this.find({ where: { post_id }, take, skip });
  }
}
