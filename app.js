"use strict";

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");
// const { url } = require("inspector");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  const fname = req.body.firstname;
  const lname = req.body.lastname;
  const email = req.body.useremail;
  // console.log(fname, lname, email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us10.api.mailchimp.com/3.0/lists/25b7bc6d6";
  const options = {
    method: "POST",
    auth: "navs1806:c77a71018f5c5004dd18c346515327ed-us10",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running at port 3000");
});

//c77a71018f5c5004dd18c346515327ed-us10
// 25b7bc6d67
