const mongoose = require("mongoose");

mongoose
  .connect(process.env.LOCALHOST)
  .then(() => {
    console.log("connection successful..");
  })
  .catch((e) => {
    console.log("no connection...");
  });
