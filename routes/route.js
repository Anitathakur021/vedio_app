module.exports = function (app) {
  var usercontrol = require("./../controler/usercontroler");

  app.route("/createUsers").post(usercontrol.Creator);
  app.route("/addViewer").post(usercontrol.Viewer);
  app.route("/upload").post(usercontrol.uploadvedio);

  app.route("/fetchfile").get(usercontrol.fetchdata);
};
