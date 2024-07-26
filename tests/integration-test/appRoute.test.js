const request = require("supertest");
const { app } = require("../../app");

describe("App Main Route", () => {
  it('should return " Social Media Application "', async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Social Media Application");
  });
});
