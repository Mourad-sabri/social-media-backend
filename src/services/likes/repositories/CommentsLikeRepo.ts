import { EntityRepository, Repository } from "typeorm";
import { Comment } from "../../comments/entities/Comment";
import { Profile } from "../../profiles/entities/Profile";
import { CommentsLikes } from "../entities/CommentsLikes";

@EntityRepository(CommentsLikes)
export class CommentLikesRepo extends Repository<CommentsLikes> {
  async likeComment(comment: Comment, profile: Profile): Promise<boolean> {
    const isLiked = await this.findOne({ where: { profile_id: profile.profile_id, comment_id: comment.comment_id } });
    if (isLiked) throw new Error("you already liked this comment !!!!!");
    const like = await this.save(
      this.create({ comment, profile, comment_id: comment.comment_id, profile_id: profile.profile_id })
    );
    if (!like) throw new Error("oppes something went wrong please try again !!!!");
    return true;
  }
  async unlikeComment(comment_likes_id: string, profile_id: string): Promise<boolean> {
    const like = await this.findOne({ where: { comment_likes_id, profile_id } });
    if (!like) throw new Error("oppes something went wrong please try again !!!");
    await this.remove(like);
    return true;
  }
  async countCommentLikes(comment_id: string): Promise<number> {
    const count = await this.findAndCount({ where: { comment_id } });
    return count[1];
  }
}
