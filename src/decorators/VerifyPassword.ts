// import { createMethodDecorator } from "type-graphql";
// import { getCustomRepository } from "typeorm";

// import { AccountRepo } from "../services/accounts/repo/AccountRepo";
// import { ApolloContext } from "../types/ApolloContext";

// type Callback = (args: any) => string;
// type Arg = string | Callback;

// export function VerifyPassword(arg?: Arg, callback?: Callback) {
//   return createMethodDecorator<ApolloContext>(async ({ args, context }, next) => {
//     const repo = getCustomRepository(AccountRepo);
//     const password = typeof arg === "function" ? arg(args) : callback ? callback : args.password;
//     const isPasswordMatched = await repo.checkPassword(password, context.account_id);
//     if (!isPasswordMatched) throw new Error(typeof arg === "string" ? arg : "wrong password please try Again ! ");
//     return next();
//   });
// }
