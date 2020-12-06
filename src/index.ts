export * from "./authentication";

import {
  addMiddleware,
  baseUrl,
  fetchRequester,
  HttpRequest,
  MiddlewareHandler,
  Requester,
} from "@thattokengirl-utilities/http";
import { AuthenticatorFactory, noopAuthentication } from "./+internal";
import {
  EBAY_PROD_URL,
  EBAY_SANDBOX_URL,
  InternalConfig,
} from "./+internal/+types";
import { buyFactory } from "./buy";

type EbayClientOptions = {
  sandbox: boolean;
  authentication: AuthenticatorFactory;
  requester?: Requester;
};

export function ebayClientFactory({
  sandbox,
  authentication = (_) => noopAuthentication,
  requester = fetchRequester(),
}: EbayClientOptions) {
  requester = addMiddleware(
    requester,
    baseUrl(sandbox ? EBAY_SANDBOX_URL : EBAY_PROD_URL),
    invalidResponseHandler
  );

  const config: InternalConfig = {
    authenticator: authentication(requester),
    requester,
  };

  return { buy: buyFactory(config) };
}

async function invalidResponseHandler(
  req: HttpRequest,
  next: MiddlewareHandler
) {
  const response = await next(req);

  if (response.status !== 200) {
    throw response;
  }

  return response;
}
