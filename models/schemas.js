const mongoose = require("mongoose");
const { Schema } = mongoose;

const emailValidator = function (v) {
  return !v || !v.trim().length || /^\S+@\S+\.\S+$/.test(v);
};

const passwordValidator = function (password) {
  if (password.length < 8) {
    return false;
  }

  if (!/\d/.test(password)) {
    return false;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return false;
  }

  if (!/[A-Z]/.test(password)) {
    return false;
  }

  return true;
};

const userSchema = new Schema({
  name: { type: String, required: true },
  surname: { type: String, required: true },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    validate: {
      validator: emailValidator,
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    validate: {
      validator: passwordValidator,
      message: (props) =>
        `Password must contain at least 8 characters, 1 number, 1 special character, and 1 uppercase letter.`,
    },
  },
  country: {
    type: String,
    validate: {
      validator: function (value) {
        return /^[A-Za-z]{2}$/.test(value);
      },
    },
  },
  admin: Boolean,
});

const cardSchema = new Schema({
  project: String,
  contractor: { type: String, required: [true, "Contractor's name required"] },
  contractorPerson: String,
  contractorPhone: String,
  contractorEmail: {
    type: String,
    lowercase: true,
    validate: {
      validator: emailValidator,
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  workerName: {
    type: String,
    required: [true, "Worker's first name required"],
    minLength: 2,
  },
  workerSurname: {
    type: String,
    required: [true, "Worker's last name required"],
    minLength: 2,
  },
  workerId: String,
  package: String,
  packageNumber: String,
  packageManager: String,
  packagePhone: String,
  packageEmail: { type: String, lowercase: true },
  deviations: [
    {
      name: String,
      id: String,
    },
  ],
  colour: { type: String, default: "yellow" },
  daysOffSite: Number,
  eventDate: {
    type: Date,
    default: Date.now,
    required: [true, "Event's date required"],
  },
  reinductionDate: Date,
  pending: { type: Boolean, default: true },
  issuer: String,
  notes: String,
  country: {
    type: String,
    validate: {
      validator: function (value) {
        return /^[A-Za-z]{2}$/.test(value);
      },
    },
  },
  project: String,
});

cardSchema.methods.close = function () {
  this.pending = false;
};

// const supportedCountries = ["DE", "FR", "IT", "UK"];
// const cardsModels = supportedCountries.reduce((models, country) => {
//   models[`Cards${country}`] = mongoose.model(`Cards${country}`, cardSchema, `cards_${country.toLowerCase()}`);
//   return models;
// }, {});

const Cards = mongoose.model("Cards", cardSchema, "cards");
const CardsDE = mongoose.model("Cards", cardSchema, "cards_de");
const CardsFR = mongoose.model("Cards", cardSchema, "cards_fr");
const CardsIT = mongoose.model("Cards", cardSchema, "cards_it");
const Users = mongoose.model("Users", userSchema, "users");

const cardsModels = { Cards, CardsDE, CardsFR, CardsIT, Users };

module.exports = cardsModels;
