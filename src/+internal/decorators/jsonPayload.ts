import { addMiddleware, clone, modify } from "@thattokengirl-utilities/http";
import { OperationFactory } from "../+types";

export default function jsonPayload<Args extends any[], Result>(): (
  op: OperationFactory<Args, Result>
) => OperationFactory<Args, Result> {
  return (factory) => {
    return (config) => {
      const { requester: oldRequester } = config;
      const requester = addMiddleware(oldRequester, (req, next) => {
        return next(
          clone(req, {
            headers: modify(req.headers, {
              Accept: "application/json",
              "Content-Type": "application/json",
            }),
          })
        );
      });

      return factory({ ...config, requester });
    };
  };
}
