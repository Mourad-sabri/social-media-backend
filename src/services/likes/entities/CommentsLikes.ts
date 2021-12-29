import { Field, ID, ObjectType } from "type-graphql";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Comment } from "../../comments/entities/Comment";
import { Profile } from "../../profiles/entities/Profile";

@ObjectType()
@Entity({ name: "comments_likes" })
export class CommentsLikes {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  comment_likes_id: string;

  @Field(() => String)
  @Column("uuid")
  comment_id: string;

  @ManyToOne(() => Comment, comment => comment.comments_likes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "commentsId" })
  comment: Comment;

  @Field(() => String)
  @Column("uuid")
  profile_id: string;

  @ManyToOne(() => Profile, profile => profile.comments_likes, { onDelete: "CASCADE" })
  @JoinColumn({ name: "profileId" })
  profile: Profile;

  @Field(() => String)
  @CreateDateColumn()
  Created_at: string;
}
