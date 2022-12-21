// require
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const saltRounds = 10;
mongoose.connect("mongodb://localhost:27017/secretsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
  User.find({ username: req.body.username }, (err, foundUser) => {
    if (!err) {
      console.log(foundUser[0]);
      bcrypt.compare(
        req.body.password,
        foundUser[0].password,
        function (error, result) {
          if (!error) {
            if (result === true) {
              res.render("secrets")
            }
            else{
              res.redirect("/")
              console.log("wrong password");
            }
          } else {
            res.redirect("/");
            console.log(error);
          }
        }
      );
    } else {
      console.log(err);
      console.log("no user found");
    }
  });
});

// register
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    if (err) {
      console.log(err);
    } else {
      const user = new User({
        username: req.body.username,
        password: hash,
      });
      user.save((error) => {
        if (!error) {
          res.render("secrets");
        } else {
          console.log(error);
        }
      });
    }
  });
});

// logout
app.get("/logout", (req, res) => {
  res.redirect("/")
});

// submitsecrets
app.get("/Submit",(req, res)=>{
  res.redirect("/")
})

// Server
app.listen("3000", () => {
  console.log("server started on port : 3000");
});
