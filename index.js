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
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions)); // Use this after the variable declaration

// Routes Middleware
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);

app.listen(3000, () => console.log("Server up and running"));
