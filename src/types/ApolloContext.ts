import { Request, Response } from "express";

export interface ApolloContext {
  req: Request;
  res: Response;
  account_id: string;
  profile_id: string;
  is_active: boolean;
  is_business_Account_Active: boolean;
  is_marketplace_account_active: boolean;
  is_confirmed: boolean;
  permissions: string[];
}
