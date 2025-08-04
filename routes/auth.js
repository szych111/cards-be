const express = require("express");
const { hash } = require("bcryptjs");
const { createJSONToken, isValidPassword } = require("../util/auth");
const { ObjectId } = require("mongoose").Types;
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
        message: "User not found for email: " + email + ".",
      });
    }
    if (user.active === false) {
      return res.status(403).json({
        message: "User account for: " + email + " is inactive",
      });
    }
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed." });
  }

  const pwIsValid = await isValidPassword(password, user.password);
  if (!pwIsValid) {
    return res.status(422).json({
      message: "Invalid email or password entered.",
    });
  }

  const token = createJSONToken(email);
  const { admin, country, _id } = user;
  const userData = { token, admin, country, id: _id };
  res.json({ userData, user });
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
      admin: "user",
      active: true,
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
    const users = await Users.find({});
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.patch("/updatePw", async (req, res, next) => {
  const id = req.body.userId;
  const password = req.body.password;
  const hashedPw = await hash(password, 12);

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

router.patch("/updateUser", async (req, res, next) => {
  const id = req.body.id;
  const email = req.body.email;
  const country = req.body.country;
  const active = req.body.active;
  const admin = req.body.admin;
  const userData = req.body;

  try {
    await Users.updateOne(
      { _id: new ObjectId(id) },
      { $set: { email, country, active, admin } }
    );

    res.json({
      message: "User updated!",
      user: { id, email, country, active, admin },
    });
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
