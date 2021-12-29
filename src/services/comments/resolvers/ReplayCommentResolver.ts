import { Arg, Ctx, FieldResolver, Mutation, Resolver, Root } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";
import * as _ from "lodash";

import { ApolloContext } from "../../../types/ApolloContext";
import { ProfileRepo } from "../../profiles/repositories/ProfileRepo";
import { ReplayComment } from "../entities/ReplayComment";
import { AddReplayComentInput } from "../input/AddReplay.input";
import { UpdateReplayComentInput } from "../input/UpdateReplayComment.input";
import { CommentReplayRepo } from "../repositories/CommentReplayRepo";
import { CommentRepo } from "../repositories/CommentRepo";
import { Profile } from "../../profiles/entities/Profile";
import { safeCompare } from "../../../helpers/safeCompare";

@Service()
@Resolver(ReplayComment)
export class ReplayCommentResolver {
  @InjectRepository(CommentReplayRepo)
  replay: CommentReplayRepo;

  @InjectRepository(CommentRepo)
  private readonly comment: CommentRepo;

  @InjectRepository(ProfileRepo)
  private readonly accountProfile: ProfileRepo;

  @Mutation(() => ReplayComment)
  async addCommentReplay(@Arg("data") data: AddReplayComentInput, @Ctx() ctx: ApolloContext): Promise<ReplayComment> {
    const profile = await this.accountProfile.loadProfile(ctx.profile_id);
    const comment = await this.comment.findOne({ where: { comment_id: data.comment_id } });
    if (!profile || !comment) throw new Error("could not add your replay to this comment please try again");
    const replay = await this.replay.addReplay(data.replay, comment, profile);
    return _.assign(replay, { isAdmin: true });
  }

  @Mutation(() => Boolean)
  async deleteReplayComment(@Arg("replay_id") replay_comment_id: string, @Ctx() ctx: ApolloContext): Promise<boolean> {
    return await this.replay.deleteReplay(replay_comment_id, ctx.profile_id);
  }

  @Mutation(() => ReplayComment)
  async updateReplayComment(@Arg("data") data: UpdateReplayComentInput, @Ctx() ctx: ApolloContext): Promise<ReplayComment> {
    const replay = await this.replay.updateReplay(data.replay, data.replay_id, ctx.profile_id);
    return _.assign(replay, { isAdmin: true });
  }

  @FieldResolver(() => Boolean)
  async isAdmin(@Root() parent: ReplayComment, @Ctx() ctx: ApolloContext): Promise<boolean> {
    return safeCompare(parent.profile_id, ctx.profile_id);
  }

  @FieldResolver(() => Profile, { nullable: true })
  async profile(@Root() parent: ReplayComment, @Ctx() ctx: ApolloContext): Promise<Profile | null> {
    const p = await this.accountProfile.loadProfile(parent.profile_id);
    if (!p) return null;
    return _.assign(p, { isAdmin: safeCompare(p.profile_id, ctx.profile_id) });
  }
}
