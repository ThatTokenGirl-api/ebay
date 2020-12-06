import { HttpResponse, Requester } from "@thattokengirl-utilities/http";
import { toBase64 } from "../+internal/+helpers";
import {
  AuthenticationLevel,
  Authenticator,
  InternalConfig,
} from "../+internal/+types";

type ApplicationAuthenticationSettings = {
  client_id: string;
  client_secret: string;
};

type ValidTokenResponse = {
  valid: true;
  access_token: string;
};

type InvalidTokenResponse = {
  valid: false;
};

type TokenResponse = (ValidTokenResponse | InvalidTokenResponse) & {
  response: HttpResponse;
};

export const application_token_url = `identity/v1/oauth2/token`;

export default function applicationAuthenticationFactory(
  settings: ApplicationAuthenticationSettings
): (requester: Requester) => Authenticator {
  let _tokenResponsePromise: Promise<TokenResponse>;
  return (requester) => async (generateNewToken = false) => {
    _tokenResponsePromise =
      generateNewToken || !_tokenResponsePromise
        ? requester({
            method: "POST",
            url: application_token_url,
            headers: {
              Authorization: `Basic ${toBase64(
                `${settings.client_id}:${settings.client_secret}`
              )}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope`,
          }).then((response) => {
            if (response.status !== 200) return { valid: false, response };

            const { access_token }: { access_token: string } = response.body;

            return { valid: true, access_token, response };
          })
        : _tokenResponsePromise;

    const response = await _tokenResponsePromise;

    return response.valid
      ? {
          value: response.access_token,
          authLevel: AuthenticationLevel.APPLICATION,
        }
      : { value: "", authLevel: AuthenticationLevel.NONE };
  };
}
