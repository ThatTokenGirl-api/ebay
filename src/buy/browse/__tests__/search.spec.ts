import bearerToken_testRunner from "../../../__tests_helpers/bearerToken.test-runner";
import jsonPayload_testRunner from "../../../__tests_helpers/jsonPayload.test-runner";

describe("function: search", () => {
  bearerToken_testRunner((client) => client.buy.browse.search, [{}], {
    href: "",
    itemSummaries: [],
    limit: 10,
    offset: 0,
    total: 10,
  });

  jsonPayload_testRunner((client) => client.buy.browse.search, [{}], {
    href: "",
    itemSummaries: [],
    limit: 10,
    offset: 0,
    total: 10,
  });
});
