import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "../../profiles/entities/Profile";

@Entity({ name: "accounts" })
export class Account {
  @PrimaryGeneratedColumn("uuid")
  account_id: string;

  @Column("text", { unique: true })
  email: string;

  @Column("text", { unique: true, nullable: true })
  phone: string;

  @Column("text")
  password: string;

  @Column("bool", { default: false })
  is_2auth_active: boolean;

  @Column("bool", { default: true })
  is_active: boolean;

  @Column("bool", { default: false })
  is_confirmed: boolean;

  @Column("bool", { default: false })
  is_business_Account_Active: boolean;

  @Column("bool", { default: false })
  is_marketplace_account_active: boolean;

  @OneToOne(() => Profile, profile => profile.account, { onDelete: "CASCADE" })
  profile: Profile;

  @Column("uuid")
  profile_id: string;
}
