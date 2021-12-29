import { rule } from "graphql-shield";
import { ApolloContext } from "../types/ApolloContext";

export const isAuth = rule({ cache: true })(async (parent, args, ctx: ApolloContext, info) => {
  return Boolean(ctx.account_id && ctx.profile_id);
});

export const isActive = rule({ cache: true })(async (parent, args, ctx: ApolloContext, info) => {
  return Boolean(ctx.is_active);
});
