import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { InjectRepository } from "typeorm-typedi-extensions";
import { Service } from "typedi";

import { ProfileRepo } from "../../profiles/repositories/ProfileRepo";
import { AccountRepo } from "../repositories/AccountRepo";
import { CreateAccountInput } from "../inputs/CreateAccount.input";
import { compare, hash } from "bcryptjs";
import { ApolloContext } from "../../../types/ApolloContext";
import { LoginInput } from "../inputs/LoginInput";
import { UpdateEmailInput } from "../inputs/UpdateEmail.input";
import { UpdatePasswordInput } from "../inputs/updatePassword.input";

@Service()
@Resolver()
export class AccountResolver {
  @InjectRepository(AccountRepo)
  private readonly account: AccountRepo;

  @InjectRepository(ProfileRepo)
  private readonly profile: ProfileRepo;

  @Mutation(() => Boolean)
  async createAccount(@Arg("data") data: CreateAccountInput, @Ctx() { req }: ApolloContext): Promise<boolean> {
    const isAccountExist = await this.account.isEmailExist(data.email);
    if (isAccountExist) throw new Error(`${data.email} already had an account please try to login`);
    const profile = await this.profile.createProfile(data);
    if (!profile) throw new Error("something went wrong please try again or contact us !!!");
    const hashedPassword = await hash(data.password, 11);
    const account = await this.account.createAccount({ email: data.email, password: hashedPassword }, profile);
    if (!account) throw new Error("something went wrong please try again or contact us !!!");
    req.session!.account_id = account.account_id;
    req.session!.profile_id = account.profile_id;
    return true;
  }

  @Mutation(() => Boolean)
  async login(@Arg("data") data: LoginInput, @Ctx() { req }: ApolloContext): Promise<boolean> {
    const account = await this.account.findByEmail(data.email);
    if (!account) throw new Error("email or password are not correct");
    const isPasswordMatched = await compare(data.password, account.password);
    if (!isPasswordMatched) throw new Error("email or password are not correct");
    req.session!.account_id = account.account_id;
    req.session!.profile_id = account.profile_id;
    return true;
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: ApolloContext): Promise<boolean> {
    return new Promise((resolve, reject) => {
      req.session!.destroy(() => reject(false));
      res.clearCookie("lq-connect");
      resolve(true);
    });
  }

  @Mutation(() => String)
  async updateEmail(@Arg("data") data: UpdateEmailInput, @Ctx() { account_id }: ApolloContext): Promise<boolean> {
    const isEmailExist = await this.account.isEmailExist(data.email);
    if (isEmailExist) throw new Error(`${data.email} already in use with an other account`);
    return await this.account.updateEmail(data.email, data.password, account_id);
  }

  @Mutation(() => Boolean)
  async updatePassword(@Arg("data") data: UpdatePasswordInput, @Ctx() { account_id }: ApolloContext): Promise<boolean> {
    return await this.account.updatePassword(data.password, data.new_password, account_id);
  }

  @Mutation(() => Boolean)
  async deleteAccount(@Arg("password") password: string, @Ctx() { account_id, req, res }: ApolloContext): Promise<boolean> {
    const account = await this.account.findByAccountId(account_id);
    if (!account) throw new Error("something went wrong please try again");
    const isPasswordMatched = await compare(password, account.password);
    if (!isPasswordMatched) throw new Error("incorrect password please try again !!!");
    await this.account.deleteAccount(account_id);
    req.session!.destroy(err => (err ? console.log(err) : null));
    res.clearCookie("lq-connect");
    return true;
  }
}
