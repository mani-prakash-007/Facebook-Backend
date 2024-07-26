//Importing Express
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 5000;
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { globalErrorHandler } = require("./middleware/errorHandler");

//Defining options for generating the Swagger documentation
const options = {
  definition: {
    openapi: "3.0.0",
    // explorer: true,
    info: {
      title: "Social Media NodeJS Application",
      version: "1.0.0",
      description:
        "This application constains basic features such as Singin , Signup , CRUD on Post , CRUD on comment , Add Like and Dislike for Posts and Comments",
    },
  },
  apis: ["./routes/*.js"], // Path to the files containing JSDoc comments for your API routes
};
// Generating the Swagger specification using the defined options
const specs = swaggerJsdoc(options);

require("dotenv").config();
//Parsing Req.Body as Json and url enocded form
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uri = process.env.MONGODB_CONN_URI;
// Connecting DB if not in test environment
if (process.env.NODE_ENV !== "test") {
  mongoose.connect(uri);
  const conn = mongoose.connection;
  conn.once("open", () => {
    console.log("DB Connected...");
  });
}

//Routes
//Sub route Imports:
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/post/comment", commentRoutes);
app.use(globalErrorHandler);

//Main Route
app.get("/", (req, res) => {
  res.status(200).send(`<h1>Social Media Application </h1>`);
});

 const server = app.listen(PORT, () => {
  console.log(`Server Running on Port : ${PORT}`);
});

module.exports = {app , server}
