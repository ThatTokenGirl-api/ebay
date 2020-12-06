import {
  applicationAuthentication,
  ebayClientFactory,
} from "../../../../src/index";

describe("search", () => {
  const ebayClient = ebayClientFactory({
    sandbox: false,
    authentication: applicationAuthentication({
      client_id: "",
      client_secret: "",
    }),
  });

  it("can search buy query", async () => {
    await ebayClient.buy.browse.search({ query: "game" }).then((response) => {
      console.log(response);
      expect(response).to.exist;
    });
  });
});
