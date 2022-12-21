// require
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// l-5
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const passportLocal = require("passport-local");
const session = require("express-session");

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

// setup session
app.use(
  session({
    secret: "our little secret",
    resave: false,
    saveUnintialized: false,
  })
);
// intialize passport and allow it to use session
app.use(passport.initialize());
app.use(passport.session());

// user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    // require: true,
    // unique: true,
  },
  password: {
    type: String,
    // require: true,
  },
});

// add passport local mongoose as plugin
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

// serializer and deserializer
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
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
 const user = new User({
  username : req.body.username,
  password : req.body.password
 })

req.login(user,(err)=>{
  if(err){
    console.log(err);
    res.redirect("/login")
  }else{
    passport.authenticate("local")(req,res,function(){
      res.redirect("/secrets")
    })
  }
})

});

// register
app.get("/register", (req, res) => {
  res.render("register");
});


// secrets
app.get("/secrets",(req,res)=>{
  if(req.isAuthenticated()){
    res.render("secrets")
  }else{
    res.redirect("/login")
  }
})



// adding user while register
app.post("/register", (req, res) => {
  User.register({username : req.body.username},req.body.password,function(err,user){
    if(err){
      console.log(err);
      res.redirect("/register")
    }else{
      passport.authenticate("local")(req,res,function(){
        res.redirect("/secrets")
      })
    }
  });
});

// logout
app.get("/logout", (req, res) => {
  res.redirect("/");
});

// submitsecrets
app.get("/Submit", (req, res) => {
  res.redirect("/");
});

// Server
app.listen("3000", () => {
  console.log("server started on port : 3000");
});
