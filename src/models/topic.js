const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  topicName: {
    type: String,
    required: true,
    trim: true,
    tolowercase: true,
    unique: true,
  },
});

topicSchema.virtual("posts", {
  ref: "Post",  
  localField: "_id",
  foreignField: "postTopic",
});


const Topic = mongoose.model("Topic", topicSchema);
module.exports = Topic;
