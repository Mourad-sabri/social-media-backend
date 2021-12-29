import { Field, ID, Int, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

import { Account } from "../../accounts/entities/Account";
import { Comment } from "../../comments/entities/Comment";
import { ReplayComment } from "../../comments/entities/ReplayComment";
import { CommentsLikes } from "../../likes/entities/CommentsLikes";
import { PostLike } from "../../likes/entities/PostLike";
import { Messages } from "../../messages/entities/Messages";
import { Post } from "../../posts/entities/Post";

@ObjectType()
@Entity({ name: "profiles" })
export class Profile {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  profile_id: string;

  @Field(() => String)
  @Column()
  first_name: string;

  @Field(() => String, { nullable: true })
  avatar_url?: string;

  @Field(() => String)
  @Column()
  last_name: string;

  @Field(() => Int)
  @Column("int")
  age: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  status: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  gender: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  job: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  country: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  city: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  contact_email: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  contact_phone: string;

  @Field(() => String, { nullable: true })
  @Column("text", { nullable: true })
  bio: string;

  @Field(() => String, { nullable: true })
  @Column("text", { nullable: true })
  url: string;

  @Field(() => Boolean, { nullable: true })
  isAdmin: boolean;

  @OneToOne(() => Account, account => account.profile, { onDelete: "CASCADE" })
  @JoinColumn({ name: "accountID" })
  account: Account;

  @Field(() => [Post])
  @OneToMany(() => Post, post => post.profile)
  posts: Post[];

  @OneToMany(() => Comment, comment => comment.profile)
  comments: Comment[];

  @OneToMany(() => ReplayComment, replay => replay.profile)
  comment_replies: ReplayComment;

  @OneToMany(() => PostLike, postLike => postLike.profile)
  post_likes: PostLike;

  @OneToMany(() => CommentsLikes, commentLikes => commentLikes.profile)
  comments_likes: CommentsLikes;

  @OneToMany(() => Messages, message => message.sender_profile)
  message: Messages[];
}
