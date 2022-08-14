const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res, next) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send({
      message: "user created successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});
router.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT,
      { expiresIn: "1h" }
    );
    res.status(200).send({ token: token, expiresIn: 3600, userId: user._id });
  } catch (e) {
    res.status(400).send({ error: "password or email is wrong" });
  }
});
module.exports = router;
