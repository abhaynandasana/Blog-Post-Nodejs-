const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const Post = require("../models/post");

//Create a post with TOken
router.post("/post/:id", auth, async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      postTopic: req.params.id,
      postCreatedBy: req.user._id,
    });

    const postData = await post.save();
    // const pd = postData.populate("postTopic");
    res.status(200).send({ sucess: "New Post added sucessfully" });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

//Update post by Post Id
router.patch("/post/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["postTitle", "postDescription"];
  const isValidUpdate = updates.every((update) =>
    allowUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({ error: "Trying to update Unvalid field" });
  }
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      postCreatedBy: req.user._id,
    });
    if (!post) {
      return res.status(404).send({ error: "No post found" });
    }
    updates.forEach((update) => (post[update] = req.body[update]));
    const updatedPost = await post.save();
    res.status(200).send(updatedPost);
  } catch (e) {
    res.status(400).send();
  }
});

//Delete post By Post ID
router.delete("/post/:id", auth, async (req, res) => {
  const post = await Post.findOneAndDelete({
    _id: req.params.id,
    postCreatedBy: req.user._id,
  });
  if (!post) {
    return res.status(400).send({ error: "Post not Found" });
  }
  res.status(200).send({ message: "Post Deleted Successfulluy" });
});

//get All Post
//posts?sortBy=likes
//posts?sortBy=Recent
router.get("/posts", async (req, res) => {
  try {
    //const sortedPost = [];
    const posts = await Post.find();

    // check for sortBy=likes
    if (req.query.sortBy === "likes") {
      let sorted;
      sorted = posts.sort((a, b) => {
        return b.likes.length - a.likes.length;
        // console.log(a.likes.length,b.likes.length)
      });
      sorted = sorted.map((data) => {
        return { PostTitle: data.postTitle, Likes: data.likes.length };
      });

      return res.status(200).send(sorted);
    }

    //check for sortBy=recent
    if (req.query.sortBy === "recent") {
      let sorted;
      sorted = posts.sort((a, b) => {
        const d1 = new Date(a.createdAt);
        const d2 = new Date(b.createdAt);
        return d2 - d1;
      });
      sorted = sorted.map((data) => {
        return {
          PostTitle: data.postTitle,
          CreatedTime: new Date(data.createdAt),
        };
      });
      return res.status(200).send(sorted);
    }

    res.status(200).send(posts);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

//Comment On any Post
router.patch("/post/:id/comment", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });

    // Check if In request body Comment is Available
    if (!post) {
      return res.status(404).send({ error: "invalid request" });
    }
    if (req.body.comment) {
      const comment = req.body.comment;
      post.comments = post.comments.concat({
        comment,
        commentedUser: req.user._id,
      });
    } else {
      return res.send({ message: "Provede a comment" });
    }
    const data = await post.save();
    res.status(200).send(data.comments);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

//Post Like and Remove like
router.patch("/post/:id/like", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      return res
        .status(404)
        .send({ message: "Requested post is not available" });
    }
    const isLiked = post.likes.find(
      (data) => data.likedUser == req.user._id.toString()
    );
    if (isLiked) {
      post.likes = post.likes.filter((data) => {
        if (data.likedUser != req.user._id.toString()) {
          return data;
        }
      });
      //res.send({ message: "You Have removed your like" });
    }
    //Add a like to the  post
    else {
      post.likes = post.likes.concat({ likedUser: req.user._id });
    }
    const data = await post.save();
    res.status(200).send(data.likes);
  } catch (e) {
    res.status(400).send({ erro: "no post" });
  }
});

//Post Dislike and remove Dislike
router.patch("/post/:id/dislike", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) {
      return res.send({ message: "No post Found to Dislike" });
    }

    const isDisliked = post.dislikes.find(
      (data) => data.dislikedUser == req.user._id.toString()
    );
    if (isDisliked) {
      post.dislikes = post.dislikes.filter((data) => {
        if (data.dislikedUser != req.user._id.toString()) {
          return data;
        }
      });
    }
    //Add a dislike to the  post
    else {
      post.dislikes = post.dislikes.concat({ dislikedUser: req.user._id });
    }
    const data = await post.save();
    res.status(200).send(data.dislikes);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

module.exports = router;
