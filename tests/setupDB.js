// tests/setup.js
const mongoose = require("mongoose");
const { server } = require("../app");

beforeAll(async () => {
  await mongoose.connect("mongodb://localhost:27017/Integration-TestDB");
  console.log("DB Connected...");
});

afterAll(async () => {
  await mongoose.connection.close();
  console.log("DB Connection Closed...");

  await new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) return reject(err);
      console.log("Server Closed");
      resolve();
    });
  });
});
