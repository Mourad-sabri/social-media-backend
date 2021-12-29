import { EntityRepository, Repository } from "typeorm";
import * as _ from "lodash";

import { Account } from "../entities/Account";
import { Profile } from "../../profiles/entities/Profile";
import { compare, hash } from "bcryptjs";

@EntityRepository(Account)
export class AccountRepo extends Repository<Account> {
  async isEmailExist(email: string): Promise<boolean> {
    const account = await this.findOne({ where: { email } });
    if (account) return true;
    return false;
  }
  async findByAccountId(account_id: string): Promise<Account | undefined> {
    return await this.findOne({ where: { account_id } });
  }
  async findByEmail(email: string): Promise<Account | undefined> {
    return await this.findOne({ where: { email } });
  }
  async createAccount({ email, password }: Pick<Account, "email" | "password">, profile: Profile): Promise<Account | null> {
    const account = await this.save(this.create({ email, password, profile, profile_id: profile.profile_id }));
    if (!account) return null;
    return account;
  }
  async updateEmail(email: string, password: string, account_id: string): Promise<boolean> {
    const account = await this.findByAccountId(account_id);
    if (!account) throw new Error("something went wrong please try again");
    const isPasswordMatched = await compare(password, account.password);
    if (!isPasswordMatched) throw new Error("incorrect password try again");
    const updatedAccount = await this.update(account_id, { email });
    if (updatedAccount.affected! < 0) throw new Error("something went wrong please try again");
    return true;
  }
  async updatePassword(password: string, new_password: string, account_id: string): Promise<boolean> {
    const account = await this.findByAccountId(account_id);
    if (!account) throw new Error("something went wrong please try again");
    const isPasswordMatched = await compare(password, account.password);
    if (!isPasswordMatched) throw new Error("incorrect password please try again");
    const hashedPassword = await hash(new_password, 11);
    const updatedAccount = await this.update(account_id, { password: hashedPassword });
    if (updatedAccount.affected! < 0) throw new Error("something went wrong please try again");
    return true;
  }
  async loadAccountInfo(account_id: string): Promise<Partial<Pick<Account, "account_id" | "email" | "phone">>> {
    const account = await this.findByAccountId(account_id);
    return _.pick(account, ["email", "phone", "account_id"]);
  }
  async deleteAccount(account_id: string): Promise<boolean> {
    const account = await this.findByAccountId(account_id);
    if (!account) throw new Error("smething went wrong please try again");
    await this.remove(account);
    return true;
  }
}
