import {
  addMiddleware,
  clone,
  HttpResponse,
  Middleware,
  modify,
} from "@thattokengirl-utilities/http";
import {
  AuthenticationLevel,
  InternalConfig,
  OperationFactory,
} from "../+types";

export default function bearerToken<Args extends any[], Result>(
  atLevel: AuthenticationLevel
): (op: OperationFactory<Args, Result>) => OperationFactory<Args, Result> {
  return (factory) => {
    return (config) => {
      const { requester: oldRequester } = config;
      const requester = addMiddleware(
        oldRequester,
        attachTokenMiddleware(atLevel, config)
      );

      return factory({ ...config, requester });
    };
  };
}

function attachTokenMiddleware(
  atLevel: AuthenticationLevel,
  config: InternalConfig
): Middleware {
  return async (req, next) => {
    const token = await config.authenticator();

    if ((token.authLevel & atLevel) !== atLevel) throw Error("");

    req = clone(req, {
      headers: modify(req.headers, "Authorization", `Bearer ${token.value}`),
    });

    let response: HttpResponse | null = null;
    try {
      response = await next(req);
    } catch (ex) {
      if (!("status" in ex && ex.status === 401)) throw ex;
    }

    if (!response) {
      const token = await config.authenticator(true);

      req = clone(req, {
        headers: modify(req.headers, "Authorization", `Bearer ${token.value}`),
      });

      response = await next(req);
    }

    return response;
  };
}
