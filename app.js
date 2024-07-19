//Importing Express
const express = require("express");
const mongoose = require("mongoose");
const app = express();

const { globalErrorHandler} = require("./middleware/errorHandler")
//Parsing Req.Body as Json and url enocded form
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

require("dotenv").config();
const uri = process.env.MONGODB_CONN_URI;
//Connecting DB
mongoose.connect(uri);
const conn = mongoose.connection;
conn.once("open", () => {
  console.log("DB Connected...");
});

//Routes
//Sub route Imports:
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/post/comment", commentRoutes);
app.use(globalErrorHandler)

//Main Route
app.get("/", (req, res) => {
  res.status(200).json({ Message: "Main Route" });
});

app.listen(5000, () => {
  console.log("Server Running on Port : 5000");
});
