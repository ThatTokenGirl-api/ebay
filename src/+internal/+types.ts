import { Requester } from "@thattokengirl-utilities/http";

export const EBAY_SANDBOX_URL = "https://api.sandbox.ebay.com";
export const EBAY_PROD_URL = "https://api.ebay.com";

export type InternalConfig = {
  requester: Requester;
  authenticator: Authenticator;
};

export type Token = {
  value: string;
  authLevel: AuthenticationLevel;
};

export type Authenticator = (generateNewToken?: boolean) => Promise<Token>;

export enum AuthenticationLevel {
  NONE = 1 << 0,
  APPLICATION = NONE | (1 << 1),
  USER = APPLICATION | (1 << 2),
}

export type AuthenticatorFactory = (requester: Requester) => Authenticator;

export type Operation<Args extends any[], Result> = (
  ...args: Args
) => Promise<Result>;
export type OperationFactory<Args extends any[], Result> = (
  config: InternalConfig
) => Operation<Args, Result>;
export type OperationFactoryDecorator<Args extends any[], Result> = (
  factory: OperationFactory<Args, Result>
) => OperationFactory<Args, Result>;
