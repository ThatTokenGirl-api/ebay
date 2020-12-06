import express, { application } from "express";
import "isomorphic-fetch";
import env from "./environment.test";
import { applicationAuthentication, ebayClientFactory } from "../../src/index";

const app = express();
const PORT = 23120;

const ebayClient = ebayClientFactory({
  sandbox: true,
  authentication: applicationAuthentication({
    client_id: env.client_id,
    client_secret: env.client_secret,
  }),
});

app.use(require("body-parser").json());

app.get("/buy.browse.search", async (req, res) => {
  const result = await ebayClient.buy.browse.search(req.query);
  console.log(result);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
