import { ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Column, CreateDateColumn, Entity, JoinColumn } from "typeorm";
import { Field, ID, Int, ObjectType } from "type-graphql";

import { Profile } from "../../profiles/entities/Profile";
import { Comment } from "../../comments/entities/Comment";
import { PostLike } from "../../likes/entities/PostLike";

@ObjectType()
@Entity({ name: "posts" })
export class Post {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  post_id: string;

  @Field(() => String)
  @Column("text")
  content?: string;

  @Field(() => String)
  @Column()
  media_type?: string;

  @Field(() => String)
  @Column("text")
  media_url?: string;

  @Field(() => String)
  @CreateDateColumn()
  created_at: string;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: string;

  @Field(() => String)
  @Column("uuid")
  profile_id: string;

  @Field(() => Boolean)
  isAdmin: boolean;

  @Field(() => Profile)
  @ManyToOne(() => Profile, profile => profile.posts, { onDelete: "CASCADE" })
  @JoinColumn({ name: "porfileId" })
  profile: Profile;

  @Field(() => [Comment])
  @OneToMany(() => Comment, comment => comment.post)
  comments: Comment[];

  @Field(() => [PostLike])
  @OneToMany(() => PostLike, postLike => postLike.post)
  post_likes: PostLike[];

  @Field(() => Int)
  post_likes_count: number;

  @Field(() => Int)
  comments_count: number;

  @Field(() => Int)
  share_count: number;

  @Field(() => Boolean, { nullable: true })
  isLiked: boolean;

  @Column("boolean", { default: false })
  isShared: boolean;
}
