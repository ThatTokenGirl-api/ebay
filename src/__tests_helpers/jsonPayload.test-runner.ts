import {
  fakeRequesterFactory,
  ok,
} from "@thattokengirl-utilities/http/testing";
import { ebayClientFactory } from "..";
import { AuthenticationLevel } from "../+internal";

export default function jsonPayload_testRunner<Args extends any[], TResult>(
  runner: (
    ebayClient: ReturnType<typeof ebayClientFactory>
  ) => (...args: Args) => Promise<TResult>,
  args: Args,
  result: TResult
) {
  describe("jsonPayload tests", () => {
    const requestHandler = jest.fn().mockResolvedValue(result);
    const fakeBackend = fakeRequesterFactory(ok(requestHandler));

    let method: (...args: Args) => Promise<TResult>;
    beforeEach(() => {
      requestHandler.mockClear();

      method = runner(
        ebayClientFactory({
          sandbox: true,
          authentication: (_) => () =>
            Promise.resolve({
              value: "user_token",
              authLevel: AuthenticationLevel.USER,
            }),
          requester: fakeBackend,
        })
      );
    });

    test("application/json is added to header", async () => {
      await method(...args);

      expect(requestHandler).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            Accept: "application/json",
            "Content-Type": "application/json",
          }),
        })
      );
    });

    test("response is returned", async () => {
      const response = await method(...args);

      expect(response).toEqual(result);
    });
  });
}
