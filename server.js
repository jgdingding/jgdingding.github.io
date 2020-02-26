#!/usr/bin/nodejs

// // -------------- load packages -------------- //

// INITIALIZATION STUFF
var express = require("express");
var app = express();
var path = require("path");
var hbs = require("hbs");
var request = require("request");
var yelp = require("yelp-fusion");

// // -------------- express initialization -------------- //

// PORT SETUP - NUMBER SPECIFIC TO THIS SYSTEM
app.set("port", process.env.PORT || 8080);
app.set("view engine", "hbs");

app.use("/js", express.static(path.join(__dirname, "js")));
app.use("/css", express.static(path.join(__dirname, "css")));

// -------------- variable definition -------------- //
// This counter is stored in RAM, and will be reset every time you
// restart the server.

const client = yelp.client(
  "jnvBl_qSJ0cJxTSy01pcCPEyAYey6gKKO3cSS_7_Ft-d8ObyIfKvxbXRdiBGcFaj9Y60k7Xtz2MyFfymIOaT6tgN1FcBzNbEbd5Zs6c-hD_GjIOB-_RY2WC58LZVXnYx"
);

// // -------------- express 'get' handlers -------------- //
// // These 'getters' are what fetch your pages

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/businessInfo", function(req, res) {
  client
    .search({
      term: "coffee",
      latitude: req.query.latitude,
      longitude: req.query.longitude
    })
    .then(response => {
      res.send(JSON.stringify(response.jsonBody.businesses));
    })
    .catch(e => {
      console.log(e);
    });
  //   res.sendFile(__dirname + "/index.html");
});

app.get("/:page", function(req, res) {
  var paramsRequest = req.params.page;

  console.log(paramsRequest);
  if (paramsRequest == "/login") {
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

// -------------- listener -------------- //
// // The listener is what keeps node 'alive.'

var listener = app.listen(app.get("port"), function() {
  console.log("Express server started on port: " + listener.address().port);
});
