import { HttpResponse } from "@thattokengirl-utilities/http";
import {
  fakeRequesterFactory,
  ok,
  path,
  post,
} from "@thattokengirl-utilities/http/testing";
import { ebayClientFactory } from "..";
import { applicationAuthentication, toBase64 } from "../+internal";
import { EBAY_SANDBOX_URL } from "../+internal/+types";
import { application_token_url } from "../authentication/applicationAuthentication";

export default function bearerToken_testRunner<Args extends any[], TResult>(
  runner: (
    ebayClient: ReturnType<typeof ebayClientFactory>
  ) => (...args: Args) => Promise<TResult>,
  args: Args,
  result: TResult
) {
  describe("bearerToken tests", () => {
    const accessToken = "application_access_token";
    const tokenHandler = jest.fn().mockResolvedValue({
      url: "",
      headers: {},
      status: 200,
      body: { access_token: accessToken },
    });
    const requestHandler = jest.fn().mockResolvedValue(result);
    const fakeBackend = fakeRequesterFactory(
      path(`${EBAY_SANDBOX_URL}/${application_token_url}`)(post(tokenHandler)),
      ok(requestHandler)
    );

    let method: (...args: Args) => Promise<TResult>;
    beforeEach(() => {
      tokenHandler.mockClear();
      requestHandler.mockClear();

      method = runner(
        ebayClientFactory({
          sandbox: true,
          authentication: applicationAuthentication({
            client_id: "client id",
            client_secret: "client secret",
          }),
          requester: fakeBackend,
        })
      );
    });

    test("request to fetch access token is made", async () => {
      await method(...args);

      expect(tokenHandler).toHaveBeenCalledWith({
        method: "POST",
        url: `${EBAY_SANDBOX_URL}/${application_token_url}`,
        headers: {
          Authorization: `Basic ${toBase64("client id:client secret")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope`,
      });
    });

    describe("successful access token is returned", () => {
      test("access_token is added to request", async () => {
        await method(...args);

        expect(requestHandler).toHaveBeenCalledWith(
          expect.objectContaining({
            headers: expect.objectContaining({
              Authorization: `Bearer ${accessToken}`,
            }),
          })
        );
      });

      test("response is returned", async () => {
        const response = await method(...args);

        expect(response).toEqual(result);
      });
    });

    describe("token request returns  NON 200 response", () => {
      const response: HttpResponse = {
        url: "token_response",
        headers: {},
        status: 401,
      };

      beforeEach(() => {
        tokenHandler.mockResolvedValueOnce(response);
      });

      test("error is throw", async () => {
        await expect(() => method(...args)).rejects.toEqual(response);
      });

      test("request to endpoint is NOT called", () => {
        expect(requestHandler).not.toHaveBeenCalled();
      });
    });
  });
}
