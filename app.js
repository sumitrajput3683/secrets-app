// require
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/secretsDB",{ useNewUrlParser: true ,useUnifiedTopology: true});

// Middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const User = new mongoose.model("User", userSchema);
// Route

// home
app.get("/", (req, res) => {
  res.render("home");
});

// login
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  User.find({username : req.body.username},(err,foundUser)=>{
    if(!err){
      console.log(foundUser[0]);
      if(foundUser[0].password === req.body.password){
        res.render("secrets")
      }else{
        console.log("Password dont match");
      }
    }else{
      console.log(err);
      console.log("no user found");
    }

  })
});

// register
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  user.save((err) => {
    if (!err) {
      res.render("secrets");
    }else{
      console.log(err);
    }
  });
});

// Server
app.listen("3000", () => {
  console.log("server started on port : 3000");
});
