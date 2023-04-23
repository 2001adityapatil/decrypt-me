//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const alert = require('alert');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb+srv://adi:2001@cluster0.ozlgteg.mongodb.net/authDB?retryWrites=true&w=majority");

mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema ({
  email: String,
  password: String,
  googleId: String,
  secret: String,
  username: String,
  task1: String,
  task2: String,
  task3: String,
  star: Number,
  time: Number,
});

// const adminSchema = new mongoose.Schema ({
//   email: String,
//   password: String,
//   googleId: String,
//   secret: String,
//   username: String,
// });

const answerSchema = new mongoose.Schema ({
  task1: String,
  task2: String,
  star: Number,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
const Answer = new mongoose.model("Answer", answerSchema);
// const Admin = new mongoose.model("Admin", adminSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

let details;
passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://decrypt-me.onrender.com/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    // console.log(profile);
    details = profile;

    User.findOrCreate({ googleId: profile.id , username: profile.displayName}, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/views/newhome.html")
});


app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile"] })
);

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/secrets");
  });


  app.post("/adminlogin", function(req, res){
  
    const user = new Admin({
      username: req.body.username,
      password: req.body.password
    });
    
    req.login(user, function(err){
      if (err) {
        console.log(err);
      } else {
        passport.authenticate("local")(req, res, function(){
          res.redirect("/admin");
        });
      }
    });
    
  });

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/secrets", function(req, res){
  User.find({"secret": {$ne: null}}, function(err, foundUsers){
    if (err){
      console.log(err);
    } else {
      if (foundUsers) {
        // console.log(foundUsers);
        // console.log(req.user);
        var data = "";
        if(typeof (req.user.username) === 'undefined')
        data = details.displayName;
        else
        data = req.user.username;
        res.render("secrets", {usersWithSecrets: req.user, userName: data});
      }
    }
  });
});

app.get("/submit", function(req, res){
  if (req.isAuthenticated()){
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});
// let abc = "unique"
var start;
var end;
var t;
app.get("/timertest1", function(req, res){
  // console.time(abc);
  if(typeof (req.user.username) === 'undefined')
      {
        User.findOne({googleId: details.id}, function(err, result) {
          if (err) throw err;
          if(result.task1 !== "completed")
          {
            start = Date.now();
            res.render("task1");
          }
          else
            res.redirect("/secrets");
        });
      }
      else
      {
        User.findOne({username: req.user.username}, function(err, result) {
          if (err) throw err;
          if(result.task1 !== "completed")
          {
            start = Date.now();
            res.render("task1");
          }
          else
            res.redirect("/secrets");
        });
      }
})
app.post("/timertest1", function(req, res){
  Answer.find({}, function(err, doc) 
  {
    if (err) res.redirect("/timertest1");
  
  if(doc[0].task1 === req.body.val)
  {
    end = Date.now();
    var prevtime = 0;
        if(typeof (req.user.username) === 'undefined')
        {
          User.findOne({googleId: details.id}, function(err, result) {
            if (err) throw err;
            prevtime = result.time;
          });
        }
        else
        {
          User.findOne({username: req.user.username}, function(err, result) {
            if (err) throw err;
            prevtime = result.time;
          });
        }
        t = prevtime + (end-start)/1000;
    // t = (end-start)/1000;
          if(typeof (req.user.username) === 'undefined')
          {
            User.findOneAndUpdate({googleId: details.id}, {$set: {task1: "completed", star: 1, time: t}} , {upsert: true}, function(err,doc) {
              if (err) { throw err; }
              else { res.redirect("/secrets"); }
            }); 
          }
          else
          {
              User.findOneAndUpdate({username: req.user.username}, {$set: {task1: "completed", star: 1, time: t}} , {upsert: true}, function(err,doc) {
                if (err) { throw err; }
                else { res.redirect("/secrets"); }
                }); 
          }
              
        }
  else
      {
        alert("Wrong answer");
        res.redirect("/timertest1");
      }
  })
  })

  app.get("/timertest2", function(req, res){

      // let isCompleted = "adi";
      if(typeof (req.user.username) === 'undefined')
      {
        User.findOne({googleId: details.id}, function(err, result) {
          if (err) throw err;
          if(result.task2 !== "completed" && result.task1 === "completed")
          {
            start = Date.now();
            res.render("task2");
          }
          else
            res.redirect("/secrets");
        });
      }
      else
      {
        User.findOne({username: req.user.username}, function(err, result) {
          if (err) throw err;
          if(result.task2 !== "completed" && result.task1 === "completed")
          {
            start = Date.now();
            res.render("task2");
          }
          else
            res.redirect("/secrets");
        });
      }
  })

  app.post("/timertest2", function(req, res){
    Answer.find({}, function(err, doc) 
    {
      if (err) res.redirect("/timertest2");
      // console.log(doc);
    
    if(doc[0].task2 === req.body.val)
    {
        end = Date.now();
      
        var prevtime = 0;
        if(typeof (req.user.username) === 'undefined')
        {
          User.findOne({googleId: details.id}, function(err, result) {
            if (err) throw err;
            prevtime = result.time;
          });
        }
        else
        {
          User.findOne({username: req.user.username}, function(err, result) {
            if (err) throw err;
            prevtime = result.time;
          });
        }
        t = prevtime + (end-start)/1000;
        if(typeof (req.user.username) === 'undefined')
        {
          User.findOneAndUpdate({googleId: details.id}, {$set: {task2: "completed", star: 2, time: t}} , {upsert: true}, function(err,doc) {
            if (err) { throw err; }
            else { res.redirect("/secrets"); }
          }); 

        }
        else
        {
            User.findOneAndUpdate({username: req.user.username}, {$set: {task2: "completed", star: 2, time: t}} , {upsert: true}, function(err,doc) {
              if (err) { throw err; }
              else { res.redirect("/secrets"); }
              }); 
        }
      }
      else
      {
        alert("Wrong answer");
        res.redirect("/timertest2");
      }
    })
})

    app.get("/timertest3", function(req, res){
      if(typeof (req.user.username) === 'undefined')
      {
        User.findOne({googleId: details.id}, function(err, result) {
          if (err) throw err;
          if(result.task3 !== "completed" && result.task2 === "completed" && result.task1 === "completed")
          {
            start = Date.now();
            res.render("task3");
          }
          else
            res.redirect("/secrets");
        });
      }
      else
      {
        User.findOne({username: req.user.username}, function(err, result) {
          if (err) throw err;
          if(result.task3 !== "completed" && result.task2 === "completed" && result.task1 === "completed")
          {
            start = Date.now();
            res.render("task3");
          }
          else
            res.redirect("/secrets");
        });
      }
    })
  
    app.post("/timertest3", function(req, res){
      if(req.body.val === "www.eLitmus.com")
      {
        end = Date.now();
        var prevtime = 0;
        if(typeof (req.user.username) === 'undefined')
        {
          User.findOne({googleId: details.id}, function(err, result) {
            if (err) throw err;
            prevtime = result.time;
            // console.log(result.time);
          });
        }
        else
        {
          User.findOne({username: req.user.username}, function(err, result) {
            if (err) throw err;
            prevtime = result.time;
            // console.log(result.time);
          });
        }
        // console.log(prevtime);
        t = prevtime + (end-start)/1000;
        // console.log(t);
        if(typeof (req.user.username) === 'undefined')
        {
          User.findOneAndUpdate({googleId: details.id}, {$set: {task3: "completed", star: 3, time: t}} , {upsert: true}, function(err,doc) {
            if (err) { throw err; }
            else { res.redirect("/secrets"); }
          }); 

        }
        else
        {
            User.findOneAndUpdate({username: req.user.username}, {$set: {task3: "completed", star: 3, time: t}} , {upsert: true}, function(err,doc) {
              if (err) { throw err; }
              else { res.redirect("/secrets"); }
              });    
        }
      }
      else
      {
        alert("Wrong answer");
        res.redirect("/timertest3");
      }
  })
    
  app.get("/leaderboard", function(req, res){
      User.find({}).sort({star:-1, time: 1}).exec(function(err, result){
        if(err) {throw err;}
  
        res.render("leaderboard", {res: result});
      }
      )
  })

  app.get("/instructions", function(req, res){
    res.render("instructions");
  })
  app.get("/clues", function(req, res){
    res.render("clues");
  })


app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});

app.post("/register", function(req, res){

  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function(){
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
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });

});







app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
