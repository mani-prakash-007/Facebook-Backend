const request = require("supertest");
const app = require("../../app");
const mongoose = require("mongoose");
const { generateRandomNumber } = require("../../randomPortNumGen");

describe("App Main Route", () => {
  //Truncating all datas in the db
  const truncateAllCollections = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
    console.log("All collections truncated");
  };

  beforeAll(async () => {
    //Server Establish
    const PORT = generateRandomNumber();
    console.log(PORT);
    server = app.listen(PORT, () => {
      console.log(`Server Running on Port : ${PORT}`);
    });
    //DB Establish
    await mongoose.connect("mongodb://localhost:27017/Integration-TestDB");
    console.log("DB Connected...");
  });

  afterAll(async () => {
    //Truncating DB datas
    await truncateAllCollections();
    //DB Connection Closing
    await mongoose.connection.close();
    console.log("DB Connection Closed...");
    //Server connection Closing
    server.close();
    console.log("Server closed...");
  });
  it('should return " Social Media Application "', async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.text).toContain("Social Media Application");
  });
});
