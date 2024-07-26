const request = require("supertest");
const app = require("../../../app");
const mongoose = require("mongoose");
const { generateRandomNumber } = require("../../../randomPortNumGen");

describe("User SignUp Route", () => {
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
  it("should return AlreadyExistError upon giving exist Email", async () => {
    const response = await request(app).post("/api/user/register").send({
      fname: "Mani",
      lname: "Prakash",
      email: "mani@gmail.com",
      password: "Mani@2003",
    });

    const expectedResponse = {
      StatusCode: 409,
      ErrorName: "EmailAlreadyExistsError",
      ErrorMessage: "Email already Exist. Please Login",
    };
    expect(response.status).toBe(409);
    expect(response.body).toMatchObject(expectedResponse);
  });

  //Test - Missing Field
  it("Should return required field error on missing fields", async () => {
    const testCases = [
      {
        data: { fname: "Mani", lname: "Prakash", email: "mani@gmail.com" },
        expectedResponse: { error: '"password" is required' },
      },
      {
        data: {
          lname: "Prakash",
          email: "mani@gmail.com",
          password: "Mani@2003",
        },
        expectedResponse: { error: '"fname" is required' },
      },
      {
        data: { fname: "Mani", email: "mani@gmail.com", password: "Mani@2003" },
        expectedResponse: { error: '"lname" is required' },
      },
      {
        data: { fname: "Mani", lname: "Prakash", password: "Mani@2003" },
        expectedResponse: { error: "Email is required." },
      },
    ];

    for (const testCase of testCases) {
      const response = await request(app)
        .post("/api/user/register")
        .send(testCase.data);
      expect(response.status).toBe(400);
      expect(response.body).toMatchObject(testCase.expectedResponse);
    }
  });
  it("should return error upon entering wrong email", async () => {
    const response = await request(app).post("/api/user/register").send({
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

  //Test - Invalid Password
  it("should return appropriate error messages for invalid passwords", async () => {
    const testCases = [
      {
        description: "no uppercase",
        payload: {
          fname: "Mani",
          lname: "Prakash",
          email: "mani@gmail.com",
          password: "mani@2003",
        },
        expectedResponse: {
          error: "Password should contain at least one uppercase character",
        },
      },
      {
        description: "no lowercase",
        payload: {
          fname: "Mani",
          lname: "Prakash",
          email: "mani@gmail.com",
          password: "MANI@2003",
        },
        expectedResponse: {
          error: "Password should contain at least one lowercase character",
        },
      },
      {
        description: "no special character",
        payload: {
          fname: "Mani",
          lname: "Prakash",
          email: "mani@gmail.com",
          password: "Mani2003",
        },
        expectedResponse: {
          error: "Password should contain at least one special character",
        },
      },
      {
        description: "no numeric character",
        payload: {
          fname: "Mani",
          lname: "Prakash",
          email: "mani@gmail.com",
          password: "Mani@mani",
        },
        expectedResponse: {
          error: "Password should contain at least one numeric character",
        },
      },
      {
        description: "less than 8 characters",
        payload: {
          fname: "Mani",
          lname: "Prakash",
          email: "mani@gmail.com",
          password: "Mani@2",
        },
        expectedResponse: {
          error: '"password" length must be at least 8 characters long',
        },
      },
    ];

    for (const testCase of testCases) {
      const response = await request(app)
        .post("/api/user/register")
        .send(testCase.payload);

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject(testCase.expectedResponse);
    }
  });
});
