const request = require("supertest");
const app = require("../../../app");
const mongoose = require("mongoose");
const { generateRandomNumber } = require("../../../randomPortNumGen");

describe("User SignIn route", () => {
  //DB Connection Setup

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
    const PORT = generateRandomNumber();
    console.log(PORT);
    server = app.listen(PORT, () => {
      console.log(`Server Running on Port : ${PORT}`);
    });
    await mongoose.connect("mongodb://localhost:27017/Integration-TestDB");
    console.log("DB Connected...");
  });

  afterAll(async () => {
    await truncateAllCollections();
    await mongoose.connection.close();
    console.log("DB Connection Closed...");

    server.close();
    console.log("Connection Closed...");
  });

  //Creating a User before login
  it("should return a response with 200 upon successful registration", async () => {
    //Test
    const response = await request(app).post("/api/user/register").send({
      fname: "Mani",
      lname: "Prakash",
      email: "mani@gmail.com",
      password: "Mani@2003",
    });
    //Actual Response
    const expectedResponse = {
      Status: "Register Successful",
      UserData: {
        first_name: "Mani",
        last_name: "Prakash",
        email: "mani@gmail.com",
        password: expect.any(String),
        _id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: expect.any(Number),
      },
    };
    //Assertion
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Test - Login
  it("should return a response with 200 upon successful login", async () => {
    //Test
    const response = await request(app).post("/api/user/login").send({
      email: "mani@gmail.com",
      password: "Mani@2003",
    });
    //Actual Response
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    const expectedResponse = {
      Details: {
        statusCode: 200,
        status: "Login Success",
        token: expect.stringMatching(jwtRegex),
      },
    };
    //Assertion
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Test - Wrong Mail
  it("should return error upon entering wrong email", async () => {
    const response = await request(app).post("/api/user/login").send({
      fname: "Mani",
      lname: "Prakash",
      email: "mani@gmail",
      password: "Mani@2003",
    });
    const expectedResponse = {
      error:
        "Please enter a valid email address with a domain of .com, .net, or .org.",
    };
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //Test - Incorrect Password
  it("should return IncorrectPasswordError upon entering wrong password", async () => {
    //Test
    const response = await request(app).post("/api/user/login").send({
      email: "mani@gmail.com",
      password: "Mani@200",
    });
    //Actual Response
    const expectedResponse = {
      StatusCode: 401,
      ErrorName: "IncorrectPasswordError",
      ErrorMessage: "Incorrect password . Check password",
    };
    //Assertion
    expect(response.status).toBe(401);
    expect(response.body).toMatchObject(expectedResponse);
  });
  //test - fields
  it("Should return required field error on missing fields", async () => {
    const testCases = [
      {
        data: { email: "mani@gmail.com" },
        expectedResponse: { error: '"password" is required' },
      },
      {
        data: { password: "Mani@2003" },
        expectedResponse: { error: "Email is required." },
      },
    ];

    for (const testCase of testCases) {
      const response = await request(app)
        .post("/api/user/login")
        .send(testCase.data);
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject(testCase.expectedResponse);
    }
  });
});
