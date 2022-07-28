var express = require("express"),
  app = express(),
  port = 4001,
  mongoose = require("mongoose"),
  users = require("./models/datamodel");
(userCtl = require("./controler/usercontroler")),
  (bodyParser = require("body-parser")),
  (multer = require("multer"));

//mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/'); // live
mongoose.connect("mongodb://localhost/Videoapp"); // local
var path = __dirname;
app.use("/streaming_app/data", express.static(path + "/data"));

app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,Auth_Token"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("port", port);

const routes = require("./routes/route");
routes(app);

app.listen(port);
module.exports = app;

console.log("todo list RESTful API server started on: " + port);
