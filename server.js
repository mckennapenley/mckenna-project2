//___________________
//Dependencies
//___________________
const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const session = require("express-session");
const methodOverride = require("method-override");
const Video = require("./models/video.js");

//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3000;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const DATABASE_URL = process.env.DATABASE_URL;

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
// Database Configuration
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Database Connection Error / Success
const db = mongoose.connection;
db.on("error", (err) => console.log(err.message + " is mongod not running?"));
db.on("connected", () => console.log("mongo connected"));
db.on("disconnected", () => console.log("mongo disconnected"));

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static("public"));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: true })); // extended: false - does not allow nested objects in query strings
//app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride("_method")); // allow POST, PUT and DELETE from a form

//boilerplate for sessions set up
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

//___________________
// Routes
//___________________
//localhost:3000

// Routes / Controllers
const userController = require("./controllers/users.js");
app.use("/users", userController);

const sessionsController = require("./controllers/sessions.js");
app.use("/sessions", sessionsController);

// //index & dashboard view
// app.get('/', (req, res) => {
// 	if (req.session.currentUser) {
// 		res.render('dashboard.ejs', {
// 			currentUser: req.session.currentUser
// 		});
// 	} else {
// 		res.render('index.ejs', {
// 			currentUser: req.session.currentUser,

// 		});
// 	}
// });

//index & dashboard view
app.get("/", (req, res) => {
  const path = req.session.currentUser ? "dashboard.ejs" : "index.ejs";

  // Video.find({}, (error, allVideos) => {
  //   res.render(path, {
  //     currentUser: req.session.currentUser,
  //     videos: allVideos,
  //   });
  // });
  Video.find({})
    .sort("-votes")
    .exec(function (error, allVideos) {
      res.render(path, {
        currentUser: req.session.currentUser,
        videos: allVideos,
      });
    });
});

// New
app.get("/new", (req, res) => {
  res.render("new.ejs");
});

// Delete
app.delete("/videos/:idx", (req, res) => {
  console.log(req.params.idx);
  Video.findByIdAndDelete(req.params.idx, (error, deletedVideo) => {
    res.redirect("/");
  });
  console.log(req.params.idx);
});

// Update
app.put("/videos/:idx", (req, res) => {
  Video.findByIdAndUpdate(
    req.params.idx,
    req.body,
    {
      new: true,
    },
    (error, updatedVideo) => {
      res.redirect(`/videos/${req.params.idx}`);
    }
  );
});

// Create
app.post("/", (req, res) => {
  Video.create(req.body, (error, createdVideo) => {
    console.log(error);
    res.redirect("/");
  });
  console.log(req.body);
});

//Edit Route
app.get("/videos/:idx/edit", (req, res) => {
  Video.findById(req.params.idx, (err, foundVideo) => {
    res.render("edit.ejs", {
      video: foundVideo,
    });
  });
});

// Show
app.get("/videos/:idx", (req, res) => {
  Video.findById(req.params.idx, (err, foundVideo) => {
    res.render("show.ejs", {
      video: foundVideo,
      currentUser: req.session.currentUser,
    });
  });
});

// Seed
const videoSeed = require("./models/videoSeed.js");

app.get("/seed", (req, res) => {
  console.log("seed route ran");
  Video.deleteMany({}, (error, allVideos) => {});

  Video.create(videoSeed, (error, data) => {
    res.redirect("/");
  });
});

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log("express is listening on:", PORT));
