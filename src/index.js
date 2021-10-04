require("dotenv").config();
const express = require("express");
require("./db/mongoose");
//const User = require("./models/userModel");
const userRouter = require("./routers/userRouter");
const topicRouter = require("./routers/topicRouter");
const postRouter = require("./routers/postRouter");
const app = express();

app.use(express.json());
//express is framework fro node js

const port = process.env.PORT;
app.use(userRouter);
app.use(topicRouter);
app.use(postRouter);
app.listen(port, () => {
  console.log("You are on port : ", port);
});
