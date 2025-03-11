const express = require("express");
const { hash } = require('bcryptjs');
const { createJSONToken, isValidPassword } = require("../util/auth");
//const { isValidEmail, isValidText } = require("../util/validation");
const { Users } = require("../models/schemas");
const { checkAuth } = require("../util/auth");
require("dotenv/config");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const data = req.body;
  const hashedPw = await hash(data.password, 12);
  //let errors = {};

  //if (!isValidEmail(data.email)) {
  //   errors.email = "Invalid email.";
  // } else {
  //   try {
  //     const existingUser = await Users.findOne({email: data.email});
  //     if (existingUser) {
  //       errors.email = "Email exists already.";
  //     }
  //   } catch (error) {}
  // }

  try {
    const newUser = new Users({
      name: data.name,
      surname: data.surname,
      email: data.email,
      password: hashedPw,
      country: data.country,
      admin: data.admin,
    });
    const savedUser = await newUser.save();
    res.status(201).json({ message: "User saved", user: savedUser });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  //const password = req.body.password;
  //const { users } = JSON.parse(process.env.USERS_JSON);

  let user;
  try {
    user = await Users.findOne({email});
    //user = await users.find((u) => u.email === email);
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
  const { admin, country, project } = user;
  res.json({ token, admin, country, project });
});

router.get("/user", async (req, res, next) => {
  const email = req.body.email;

  try {
    const userData = await Users.findOne({email});
    res.json({ user: userData });
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

router.use(checkAuth);

router.patch("/:id", async (req, res, next) => {
  const data = req.body;

  let errors = {};

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Updating the user failed due to validation errors",
      errors,
    });
  }

  try {
    await Users.updateOne({ _id: req.params.id }, data);
    res.json({ message: "User updated.", user: data });
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
