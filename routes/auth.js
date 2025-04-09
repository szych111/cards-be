const express = require("express");
const { hash } = require("bcryptjs");
const { ObjectId } = require("mongoose").Types;
const { createJSONToken, isValidPassword } = require("../util/auth");
//const { isValidEmail, isValidText } = require("../util/validation");
const { Users } = require("../models/schemas");
const { checkAuth } = require("../util/auth");
require("dotenv/config");

const router = express.Router();

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  let user;
  try {
    user = await Users.findOne({ email });
    if (!user) {
      return res.status(422).json({
        message: "User not found for email: " + email,
        errors: { credentials: "Invalid email entered." },
      });
    }
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed." });
  }

  const pwIsValid = await isValidPassword(password, user.password);
  if (!pwIsValid) {
    return res.status(422).json({
      message: "Invalid credentials.",
      errors: { credentials: "Invalid email or password entered." },
    });
  }

  const token = createJSONToken(email);
  const { admin, country, project, _id } = user;
  const userData = { token, admin, country, id: _id };
  res.json({ userData });
});

router.use(checkAuth);

router.post("/signup", async (req, res, next) => {
  const data = req.body;
  const hashedPw = await hash(data.password, 12);

  try {
    const newUser = new Users({
      email: data.email,
      password: hashedPw,
      country: data.country,
      //project: data.project,
      admin: data.admin,
      active: data.active,
    });
    const savedUser = await newUser.save();
    res.status(201).json({
      message: "User saved with e-mail: " + data.email,
      user: savedUser,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/users", async (req, res, next) => {
  try {
    const usersData = await Users.find({});
    res.json({ users: usersData });
  } catch (error) {
    next(error);
  }
});

router.patch("/update", async (req, res, next) => {
  const id = req.body.userId;
  const password = req.body.password;
  const hashedPw = await hash(password, 12);

  let errors = {};

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Updating the user failed due to validation errors",
      errors,
    });
  }

  try {
    await Users.updateOne(
      { _id: new ObjectId(id) },
      { $set: { password: hashedPw } }
    );
    res.json({ message: "Password updated!", user: { id, password } });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Users.deleteOne({ _id: req.params.id });
    res.json({ message: "User deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
