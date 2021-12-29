import { Field, ID, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Post } from "../../posts/entities/Post";
import { Profile } from "../../profiles/entities/Profile";

@ObjectType()
@Entity({ name: "posts_likes" })
export class PostLike {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  post_like_id: string;

  @Field(() => String)
  @Column("uuid")
  profile_id: string;

  @Field(() => Profile)
  @ManyToOne(() => Profile, profile => profile.post_likes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "profileId" })
  profile: Profile;

  @Field(() => String)
  @Column("uuid")
  post_id: string;

  @OneToMany(() => Post, post => post.post_likes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "postId" })
  post: Post;

  @Field(() => String)
  @CreateDateColumn()
  created_at: string;
}
