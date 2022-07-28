"use strict";
var mongoose = require("mongoose");

var CreatorSchema = new mongoose.Schema(
    {
      createrId: { type: Number, required: true },
      name: { type: String },
      email: { type: String, trim: true ,required: [true, "Email is required"]},
      token: { type: String },
    },
    { timestamps: true }
  );

  var VideoSchema = new mongoose.Schema(
    {
      createrId: { type: Number, required: true },
      name: { type: String },
      title: { type: String },
      description: { type: String },
      tags: [String],
      category: { type: String },
      
    },
    { timestamps: true }
  );

  var ViewerSchema = new mongoose.Schema(
    {
     name:{type: String},
     age: {type: Number},
     email: {type: String , trim: true},
     token: { type: String },
    },
    {timestamps: true}
  );
  
  
  module.exports = mongoose.model("Creatordata", CreatorSchema);
  module.exports = mongoose.model("PostedVideoData", VideoSchema);
  module.exports = mongoose.model("ViewerData", ViewerSchema);

