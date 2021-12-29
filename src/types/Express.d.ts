export declare global {
  namespace Express {
    interface Session {
      account_id?: string;
      profile_id?: string;
      is_active?: boolean;
      is_business_Account_Active?: boolean;
      is_marketplace_accoutn_active?: boolean;
      is_confirmed?: boolean;
      permissions?: string[];
    }
  }
}
