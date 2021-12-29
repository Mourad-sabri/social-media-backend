import { allow, and, not, rule, shield } from "graphql-shield";
import { ApolloContext } from "../types/ApolloContext";
import { isActive, isAuth } from "./rules";

export const permissions = shield({
  Query: {
    "*": isAuth,
  },
  Mutation: {
    "*": isAuth,
    login: allow,
    createAccount: allow,
    // reActivateAccount: isAuth,
  },
});
