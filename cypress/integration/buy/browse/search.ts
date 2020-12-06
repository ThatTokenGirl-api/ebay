import { response } from "express";

describe("search", () => {
  it("can search by query", () => {
    cy.request("/buy.browse.search?query=game").should(({ body }) => {
      expect(body).to.exist;
    });
  });
});
