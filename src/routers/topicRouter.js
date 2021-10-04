const express = require("express");
const router = new express.Router();

const auth = require("../middleware/auth");

const Topic = require("../models/topic");

//Add new Topic
router.post("/topic", auth, async (req, res) => {
  try {
    // const topic = new Topic(req.body);
    const topic = new Topic({
      ...req.body,
      createdBy: req.user._id,
    });
    const topicData = await topic.save();
    res.status(200).send(topicData);
  } catch (e) {
    res.status(400).send({ error: "Can not Add this topic" });
  }
});

//Get All topics
router.get("/topics", async (req, res) => {
  try {
    const topics = await Topic.find();
    res.status(200).send(topics);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

//get all post of any TopicId
router.get("/topics/:id", async (req, res) => {
  try {
    const topic = await Topic.findOne({ _id: req.params.id });
    //console.log(topic)
    const posts = await topic.populate("posts");
    res.status(200).send(posts.posts);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});
module.exports = router;
