import { EntityRepository, Repository } from "typeorm";

import { Profile } from "../../profiles/entities/Profile";
import { Comment } from "../entities/Comment";
import { ReplayComment } from "../entities/ReplayComment";

@EntityRepository(ReplayComment)
export class CommentReplayRepo extends Repository<ReplayComment> {
  async addReplay(replay: string, comment: Comment, profile: Profile): Promise<ReplayComment> {
    const savedReplay = await this.save(
      this.create({ replay, comment, comment_id: comment.comment_id, profile, profile_id: profile.profile_id })
    );
    if (!savedReplay) throw new Error("could not save your replay please try again");
    return savedReplay;
  }
  async deleteReplay(replay_id: string, profile_id: string): Promise<boolean> {
    const replay = await this.findOne({ where: { comment_replay_id: replay_id, profile_id } });
    if (!replay) throw new Error("could not delete your replay please try again !!");
    await this.remove(replay);
    return true;
  }
  async updateReplay(updatedReplay: string, replay_id: string, profile_id: string): Promise<ReplayComment> {
    const replay = await this.createQueryBuilder()
      .where("comment_replay_id = :replay_id", { replay_id })
      .andWhere("profile_id = :profile_id", { profile_id })
      .update()
      .set({ replay: updatedReplay })
      .output("*")
      .execute();
    if (replay.affected! < 1) throw new Error("could not update you replay");
    return replay.raw[0];
  }
  async loadReplies(comment_id: string, take: number, skip: number): Promise<ReplayComment[]> {
    return await this.find({ where: { comment_id }, take, skip });
  }
}
