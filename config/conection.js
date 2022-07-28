const mongoose = require("mongoose");

exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect("mongodb://localhost/streamingapp", {})
    .then(() => {
      console.log("connected");
    })
    .catch((error) => {
      console.log("database connection failed.");
      console.error(error);
      process.exit(1);
    });
};
