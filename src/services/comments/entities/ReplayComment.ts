import { Field, ID, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Profile } from "../../profiles/entities/Profile";
import { Comment } from "./Comment";

@ObjectType()
@Entity()
export class ReplayComment {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  comment_replay_id: string;

  @Field(() => String)
  @Column("text")
  replay: string;

  @Field(() => String)
  @CreateDateColumn()
  created_at: string;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: string;

  @Field(() => Boolean)
  isAdmin: boolean;

  @Field(() => String)
  @Column("uuid")
  comment_id: string;

  @ManyToOne(() => Comment, comment => comment.replies, { onDelete: "CASCADE" })
  comment: Comment;

  @Field(() => String)
  @Column("uuid")
  profile_id: string;

  @Field(() => Profile)
  @ManyToOne(() => Profile, profile => profile.comment_replies, { onDelete: "CASCADE" })
  profile: Profile;
}
