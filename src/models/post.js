//const express = require('express');
const mongoose = require("mongoose");
const User = require("./userModel");

const postSchema = new mongoose.Schema(
  {
    postTitle: {
      type: String,
      required: true,
      trim: true,
    },
    postDescription: {
      type: String,
      trim: true,
    },
    comments: [
      {
        commentedUser: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        comment: {
          type: String,
          requied: true,
        },
      },
    ],
    likes: [
      {
        likedUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    dislikes: [
      {
        dislikedUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    postTopic: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Topic",
    },
    postCreatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
