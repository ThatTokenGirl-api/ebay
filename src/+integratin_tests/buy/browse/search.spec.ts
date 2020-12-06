import "isomorphic-fetch";

import {
  applicationAuthentication,
  ebayClientFactory,
} from "../../../../src/index";

describe("search", () => {
  const ebayClient = ebayClientFactory({
    sandbox: true,
    authentication: applicationAuthentication({
      client_id: "",
      client_secret: "",
    }),
  });

  test("can search by query", async () => {
    const response = await ebayClient.buy.browse.search({ query: "game" });

    expect(response).toBeTruthy();
  });
});
