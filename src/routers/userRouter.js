const express = require("express");
const router = new express.Router();

const auth = require("../middleware/auth");
const User = require("../models/userModel");

router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    const newUser = await user.save();
    const token = await user.generateAuthToken();
    //  const userObj = newUser.toJSON();
    res.send(newUser);
  } catch (e) {
    res.status(400).send({
      error: e.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
    //res.send({ msg: `Mr./ Ms. ${user.name} You have loggedin sucessfully` });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.status(200).send({ success: "Logout Successfull" });
  } catch (e) {
    res.status(400).send();
  }
});


module.exports = router;
