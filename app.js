require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

console.log(md5("123456"));   // Demondtrating how md5 hashes strings / passwords.

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

// By adding "new mongoose.Schema this is now an object created from the "mongoose.Schema" class as required in the mongoose-encryption documentaion (and no longer a simple javascript object).
const userSchema = new mongoose.Schema ({   
  email: String,
  password: String
});


const User = new mongoose.model("User", userSchema)

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

////////////////////////// Level 1 - Username and Password Only //////////////////////////

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,    // Catching whatever the user typed into the username field.
    password: req.body.password   // Catching whatever the user typed into the password field. field.
  });

  newUser.save(function(err){
    if (err) {
      console.log(err);
    } else {
      res.render("Secrets");
    }
  });
});

////////////////////////// Level 3 - md5 hashing passwords //////////////////////////

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = md5(req.body.password);   // Catching whatever the user typed into the password field and turning it into a ireversible hash.

//  Looking through our "User.findOne" collection of users in our data base to see if the "email" field which is in our database matches with the "username" that is the user name who is trying to log in.
  User.findOne({email: username}, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      // Checking if the user username "foundUser" that was found matches the password that the user typed in the loging page.
      if (foundUser) {  
        // Comparing the password hash inside our data base "foundUser.password" against the hashed version "password" that the user has typed into the password field and is trying to log in with.
        if (foundUser.password === password)  {
          res.render("secrets");
        }
      }
    }
  });    
});






app.listen(3000, function(req, res){
  console.log("Server started on port 3000.");
});
