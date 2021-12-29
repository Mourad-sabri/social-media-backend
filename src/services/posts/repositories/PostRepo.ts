import { EntityRepository, Repository } from "typeorm";
import { Post } from "../entities/Post";

@EntityRepository(Post)
export class PostRepo extends Repository<Post> {
  async findPost(post_id: string): Promise<Post> {
    const post = await this.findOne({ where: { post_id } });
    if (!post) throw new Error("post not exist");
    return post;
  }

  async createPost(data: Partial<Post>): Promise<Post> {
    const post = await this.save(this.create(data));
    if (!post) throw new Error("something went wrong please try again");
    return post;
  }

  async removePost(post_id: string, profile_id: string): Promise<boolean> {
    const post = await this.findOne({ where: { post_id, profile_id } });
    if (!post) throw new Error("could not delete this post please try again !!!!");
    await this.remove(post);
    return true;
  }

  async updatePost(data: Partial<Omit<Post, "profile" | "post_id">>, post_id: string, profile_id: string): Promise<Post> {
    const post = await this.createQueryBuilder()
      .where("post_id = :post_id", { post_id })
      .andWhere("profile_id = :profile_id", { profile_id })
      .update()
      .set(data)
      .output("*")
      .execute();
    if (post.affected! < 1) throw new Error("Soory we couldn't update post please try again later !!!");
    return post.raw[0];
  }

  async findAllPost(take: number, skip: number): Promise<Post[]> {
    return await this.find({ take, skip });
  }

  async findProfilePosts(profile_id: string, take: number, skip: number): Promise<Post[]> {
    return await this.find({ where: { profile_id }, take, skip });
  }
}
