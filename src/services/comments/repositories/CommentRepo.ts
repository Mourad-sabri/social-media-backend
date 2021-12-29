import { EntityRepository, Repository } from "typeorm";
import { Post } from "../../posts/entities/Post";
import { Profile } from "../../profiles/entities/Profile";
import { Comment } from "../entities/Comment";

@EntityRepository(Comment)
export class CommentRepo extends Repository<Comment> {
  async createComment(commentText: string, profile: Profile, post: Post): Promise<Comment> {
    const comment = await this.save(
      this.create({ comment: commentText, post, profile, post_id: post.post_id, profile_id: profile.profile_id })
    );
    if (!comment) throw new Error("we could not save your comment please try again");
    return comment;
  }
  async updateComment(comment_id: string, profile_id: string, comment: string): Promise<Comment> {
    const updatedComment = await this.createQueryBuilder()
      .where("comment_id = :comment_id", { comment_id })
      .andWhere("profile_id = :profile_id", { profile_id })
      .update()
      .set({ comment })
      .output("*")
      .execute();
    if (updatedComment.affected! < 1) throw new Error("we could not update your comment please try again");
    return updatedComment.raw[0];
  }
  async deleteComment(comment_id: string, profile_id: string): Promise<boolean> {
    const comment = await this.findOne({ where: { comment_id, profile_id } });
    if (!comment) throw new Error("we coud not delete your comment please try again");
    await this.remove(comment);
    return true;
  }
  async loadComments(post_id: string, take: number, skip: number): Promise<Comment[]> {
    return this.find({ where: { post_id }, take, skip });
  }
}
