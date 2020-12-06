import { AuthenticationLevel, Authenticator, Token } from "../+internal/+types";

export default function noopAuthentication(): Promise<Token> {
  return Promise.resolve({ value: "", authLevel: AuthenticationLevel.NONE });
}
