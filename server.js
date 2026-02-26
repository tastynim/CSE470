console.log("SERVER.JS IS RUNNING ✅");
const express = require("express");
const connectDB = require("./config/db");

const app = express();


connectDB();

app.get("/", (req, res) => {
  res.send("Server running successfully");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});