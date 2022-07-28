"use strict";
const mongoose = require("mongoose");
const User = mongoose.model("Creatordata");
const PostedVideoData = mongoose.model("PostedVideoData");
const ViewerData = mongoose.model("ViewerData");
var fs = require("fs");
var multer = require("multer");
var jwt = require("jsonwebtoken");

var jwtkey = "jwt";

const Creator = async (req, res) => {
  console.log(req.body);
  try {
    const data = {
      createrId: req.body.id,
      name: req.body.name,
      email: req.body.email,
    };

    const newUser = new User(data);
    const token = jwt.sign({ data }, jwtkey, {
      expiresIn: "9h",
    });

    const result = await newUser.save();
    res.send({ result: result, token: token });
  } catch (err) {
    console.log(err);
    res.send("Error", +err);
  }
};

const Viewer = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      age: req.body.age,
      email: req.body.email,
    };
    const newViewerData = new ViewerData(data);
    const token = jwt.sign({ data }, jwtkey, {
      expiresIn: "2h",
    });
    console.log(token);
    const result = await newViewerData.save();
    res.send({ result: result, token: token });
  } catch (err) {
    res.send("Error", +err);
  }
};

const uploadvedio = async (req, res) => {
  try {
    let dir = "data/pic/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, dir);
      },
      filename: function (req, file, cb) {
        console.log("file.originalname", file.originalname);
        var fileExtn = file.originalname.split(".").pop(-1);
        cb(null, new Date().getTime() + "." + fileExtn);
      },
    });

    var uploaded = multer({ storage: storage }).single("vedio");

    uploaded(req, res, async function (err) {
      console.log(req.body);
      const data = {
        createrId: req.body.createrId,
        name: req.file.filename,
        title: req.body.title,
        description: req.body.description,
        tags: req.body.tags,
        category: req.body.category,
      };
      console.log(data);
      const upload = new PostedVideoData(data);
      const result = await upload.save();
      sendMails(result);
      console.log(result);
      res.send(upload);
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

const sendMails = async (results) => {
  let user = await ViewerData.find();
  console.log(user);
  var handlebars = require("handlebars");
  var fs = require("fs");
  var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
      if (err) {
        throw err;
        callback(err);
      } else {
        callback(null, html);
      }
    });
  };
  var nodemailer = require("nodemailer");
  var smtpTransport = require("nodemailer-smtp-transport");

  var transporter = nodemailer.createTransport(
    smtpTransport({
      service: "gmail",
      auth: {
        user: "anitadeviindiit@gmail.com",
        pass: "kjnqntfcnyjypudn ",
      },
    })
  );

  if (user.length === 0) return res.send({ status: false });

  user.forEach((key) => {
    console.log(key.name);
    readHTMLFile(__dirname + "/../templates/email.html", function (err, html) {
      var template = handlebars.compile(html);
      var replacements = {
        USER: key.name,
        link: `http://localhost:4001/streaming_app/data/pic/` + results.name,
      };
      // console.log(user[i].name);

      var htmlToSend = template(replacements);
      var mailOptions = {
        from: "streaming app <anitadeviindiit@gmail.com>",
        to: key.email,
        subject: "Email Account Confirmation",
        html: htmlToSend,
      };
      transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
          console.log("email eror", error);
          res.send({
            msg: "Internal Server Error, Try again",
            status: 2,
            data: null,
          });
        } else {
          // res.send({
          //   msg: "Your account has been registered",
          //   status: 1,
          // });
        }
      });
    });
  });
};

const fetchdata = async (req, res) => {
  console.log(req.body);
  try {
    const data = await PostedVideoData.findById({ _id: req.body.id });
    return res.send(data);
  } catch (err) {
    res.send().json({
      status: false,
      message: "cannot get data",
    });
  }
};




exports.Creator = Creator;
exports.Viewer = Viewer;
exports.uploadvedio = uploadvedio;
exports.fetchdata = fetchdata;

