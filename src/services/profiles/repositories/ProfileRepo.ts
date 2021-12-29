import { EntityRepository, Repository } from "typeorm";
import { Profile } from "../entities/Profile";

@EntityRepository(Profile)
export class ProfileRepo extends Repository<Profile> {
  async loadProfile(profile_id: string): Promise<Profile | undefined> {
    return await this.findOne({ where: { profile_id } });
  }
  async createProfile(data: Pick<Profile, "first_name" | "last_name" | "age">): Promise<Profile | null> {
    return await this.save(this.create(data));
  }
  async updateProfile(data: Partial<Profile>, profile_id: string): Promise<Partial<Profile>> {
    const profile = await this.createQueryBuilder()
      .where("profile_id = :profile_id", { profile_id })
      .update()
      .set(data)
      .output("*")
      .execute();
    if (profile.affected! < 1) throw new Error("something went wrong please try again");
    return profile.raw[0];
  }
}
