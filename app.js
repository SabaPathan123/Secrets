//jshint esversion:6
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
mongoose.set('strictQuery', false);
const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true
});

const userSchema = mongoose.Schema({
  email: String,
  password: String
});

const secret = process.env.SECRET;
//const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt,{secret : secret, encryptedFields: ['password'] })

const User = mongoose.model("User", userSchema);

app.get("/", function(request, response) {
  response.render("home");
});

app.get("/login", function(request, response) {
  response.render("login");
});

app.get("/register", function(request, response) {
  response.render("register");
});

app.post("/register", function(request, response) {
  const newUser = new User({
    email: request.body.username,
    password: request.body.password
  });

  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      response.render('secrets');
    }
  });
});

app.post("/login", function(request, response) {
  const username = request.body.username;
  const password = request.body.password;

  User.findOne({
    email: username
  }, function(err, user) {
    if (user.password == password) {
      response.render("secrets");
    } else {
      response.redirect("/login");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
