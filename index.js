const express = require("express");

const app = express();

const dotenv = require("dotenv");

const mongoose = require("mongoose");
// Import Routes
const authRoute = require("./routes/auth.js");
const postRoute = require("./routes/posts.js");
dotenv.config();

mongoose
  .connect(process.env.DB_CONNECT, { useNewUrlParser: true })
  .then((res) => console.log("connected to db"));

//Middlewares
app.use(express.json());
// Routes Middleware
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(3000, () => console.log("Server up and running"));
