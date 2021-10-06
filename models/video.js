const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Video Schema
const videoSchema = Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  tags: { type: [String] },
  votes: {
    type: Number,
    default: 0,
  },
  comments: [{ user: String, comment: String }],
});

//Video model
const Video = mongoose.model("Video", videoSchema);

//Export User Model
module.exports = Video;
