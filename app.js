
//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();
const session = require('express-session');
const passport = require ("passport");
const passportLocalMoongoose = require("passport-local-mongoose");




app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: 'Our Little Secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true,  useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

const userSchema =new mongoose.Schema({
  email : String,
  password : String
});

userSchema.plugin(passportLocalMoongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/secrets", function(req, res){
  if(req.isAuthenticated()){
    res.render("secrets");
  }else{
    res.redirect("/login");
  }
});

app.post("/register", function(req, res){

  User.register({username: req.body.username}, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    }else{
passport.authenticate("local")(req, res , function(){
  res.redirect("/secrets");
});
    }

    });
  });

  app.post("/login", function(req, res){
    const user = new User({
       username: req.body.username,
       password: req.body.password
    });
    req.login(user, function(err){
      if(err){
        console.log(err);;
      }else{
        passport.authenticate("local")(req, res , function(){
          res.redirect("/secrets");
        });
      }

    })
  });



app.listen(3000, function(){
  console.log("Server is listening at port 3000");
});



//   bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
//     const newUser = new User({
//       email : req.body.username,
//       password: hash
//     });
//     newUser.save(function(err){
//       if(err){
//         ser.send(err);
//       }else{
//         res.render("secrets");
//       }
//     });
// });


// app.post("/login", function(req, res){
//   // const userName = req.body.username;
//   // const pass = req.body.password;
//   // User.findOne({email: userName}, function(err, foundUser){
//   //   if(!err){
//   //     if(foundUser){
//   //       bcrypt.compare(pass, foundUser.password, function(err, result) {
//   //     if (result===true){
//   //       res.render("secrets");
//   //     }
//   //     else{res.render("Please Register");}
//   // });
//   //
//   //
//   //     }
//   //   }else{console.log(err);}
//   // });
// });
