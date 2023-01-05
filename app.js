//jshint esversion:6
require('dotenv').config();

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
mongoose.set('strictQuery', false);
const app = express();
const bcrypt = require("bcrypt");
const saltRounds = 10;

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

bcrypt.hash(request.body.password, saltRounds, function(err, hash){
  const newUser = new User({
    email: request.body.username,
    password: hash
  });

  newUser.save(function(err) {
    if (err) {
      console.log(err);
    } else {
      response.render('secrets');
    }
  });
});
});

app.post("/login", function(request, response) {
  const username = request.body.username;
  const password = request.body.password;

  User.findOne({email: username}, function(err, user) {

    bcrypt.compare(password, user.password,function(err,result){
      if (result === true) {
        response.render("secrets");
      } else {
        response.redirect("login");
      }
    });

  });
});

app.get("/logout", function(request,response){
  response.render('logout');
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
