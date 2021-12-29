import { Field, ID, Int, ObjectType } from "type-graphql";
import { OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";
import { CommentsLikes } from "../../likes/entities/CommentsLikes";
import { Post } from "../../posts/entities/Post";
import { Profile } from "../../profiles/entities/Profile";
import { ReplayComment } from "./ReplayComment";

@ObjectType()
@Entity()
export class Comment {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  comment_id: string;

  @Field(() => String)
  @Column("text")
  comment: string;

  @Field(() => String)
  @CreateDateColumn()
  created_at: string;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: string;

  @Field(() => String)
  @Column("uuid")
  post_id: string;

  @Field(() => String)
  @Column("uuid")
  profile_id: string;

  @Field(() => Boolean)
  isAdmin: boolean;

  @ManyToOne(() => Post, post => post.comments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "postId" })
  post: Post;

  @Field(() => Boolean)
  isLiked: boolean;

  @Field(() => Profile)
  @ManyToOne(() => Profile, profile => profile.comments, { onDelete: "CASCADE" })
  @JoinColumn({ name: "profileId" })
  profile: Profile;

  @Field(() => Int)
  comment_likes_count: number;

  @OneToMany(() => ReplayComment, replay => replay.comment_replay_id)
  replies: ReplayComment;

  @Field(() => [CommentsLikes])
  @OneToMany(() => CommentsLikes, commentLikes => commentLikes.comment)
  comments_likes: CommentsLikes[];
}
