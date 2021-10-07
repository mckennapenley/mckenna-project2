// Dependencies
const express = require("express");
const videoRouter = express.Router();
const Video = require("../models/video.js");

// Seed
const videoSeed = require("../models/videoSeed.js");

videoRouter.get("/seed", (req, res) => {
  console.log("seed route ran");
  Video.deleteMany({}, (error, allVideos) => {});

  Video.create(videoSeed, (error, data) => {
    res.redirect("/videos");
  });
});

//index & dashboard view
videoRouter.get("/", (req, res) => {
  const path = req.session.currentUser ? "dashboard.ejs" : "index.ejs";

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
videoRouter.get("/new", (req, res) => {
  res.render("new.ejs", {
    currentUser: req.session.currentUser,
  });
});

// Delete
videoRouter.delete("/:idx", (req, res) => {
  console.log(req.params.idx);
  Video.findByIdAndDelete(req.params.idx, (error, deletedVideo) => {
    res.redirect("/videos");
  });
  console.log(req.params.idx);
});

// Update
videoRouter.put("/:idx", (req, res) => {
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

// Comment
videoRouter.put("/:idx/comment", (req, res) => {
  console.log("user" + req.body.userId);
  console.log("comment" + req.body.comment);
  console.log(req.params);
  console.log(req.body);

  Video.updateOne(
    {
      _id: req.params.idx,
    },
    {
      $push: {
        comments: {
          comment: req.body.comment,
          user: req.body.userId,
        },
      },
    },

    {
      new: true,
    },
    (error, updatedVideo) => {
      res.redirect(`/videos/${req.params.idx}`);
    }
  );
});

// Upvote
videoRouter.put("/:idx/upvote", (req, res) => {
  console.log("hello i hit it");
  Video.findOneAndUpdate(
    { _id: req.params.idx },
    // req.params.idx,
    { $inc: { votes: 1 } },
    { new: true },
    (error, updateVideo) => {
      res.json({
        status: 200,
        votes: updateVideo.votes,
      });
    }
  );
});

// Downvote
videoRouter.put("/:idx/downvote", (req, res) => {
  console.log("hello i hit it");
  Video.findOneAndUpdate(
    { _id: req.params.idx },
    { $inc: { votes: -1 } },
    { new: true },
    (error, updateVideo) => {
      console.log("updatedVideo.votes: " + updateVideo.votes);
      res.json({
        status: 200,
        votes: updateVideo.votes,
      });
    }
  );
});

// Create
videoRouter.post("/", (req, res) => {
  Video.create(req.body, (error, createdVideo) => {
    console.log(error);
    res.redirect("/videos");
  });
  console.log(req.body);
});

//Edit Route
videoRouter.get("/:idx/edit", (req, res) => {
  Video.findById(req.params.idx, (err, foundVideo) => {
    res.render("edit.ejs", {
      video: foundVideo,
      currentUser: req.session.currentUser,
    });
  });
});

// Show
videoRouter.get("/:idx", (req, res) => {
  Video.findById(req.params.idx, (err, foundVideo) => {
    res.render("show.ejs", {
      video: foundVideo,
      currentUser: req.session.currentUser,
    });
  });
});

// Export User Router
module.exports = videoRouter;
