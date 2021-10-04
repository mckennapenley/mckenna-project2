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
  upvotes: { type: Number, default: 0 },
  downvotes: { type: Number, default: 0 },
  votes: {
    type: Number,
    default: function () {
      return this.upvotes - this.downvotes;
    },
  },
});

//Video model
const Video = mongoose.model("Video", videoSchema);

//Export User Model
module.exports = Video;
