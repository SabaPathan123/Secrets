//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended : true}));

app.get("/", function(request,response){
  response.render("home");
});

app.get("/login", function(request,response){
  response.render("login");
});

app.get("/register", function(request,response){
  response.render("register");
});

app.listen(3000, function(){
  console.log("Server started on port 3000");
});
