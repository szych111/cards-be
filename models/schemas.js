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

const emailValidation = {
  type: String,
  lowercase: true,
  unique: true,
  validate: {
    validator: emailValidator,
    message: (props) => `${props.value} is not a valid email!`,
  },
};

const countryValidation = {
  type: String,
  validate: {
    validator: function (value) {
      return /^[A-Za-z]{2}$/.test(value);
    },
  },
};

const namesValidator = function (value) {
  if (this.colour !== "green" && !value) {
    return false;
  }
  return true;
};

const user = {
  email: emailValidation,
  password: {
    type: String,
    validate: {
      validator: passwordValidator,
      message: (props) =>
        `Password must contain at least 8 characters, 1 number, 1 special character, and 1 uppercase letter.`,
    },
  },
  country: countryValidation,
  project: String,
  admin: String,
  active: Boolean,
  dateActive: {
    type: Date,
    default: Date.now,
  },
  dateInactive: Date,
};

const userSchema = new Schema(user);

const contractor = {
  contractor: String,
  contractorPerson: String,
  contractorPhone: String,
  contractorEmail: { ...emailValidation, unique: false },
};

const package = {
  package: String,
  packageManager: String,
  packagePhone: String,
  packageEmail: { ...emailValidation, unique: false },
  project: String,
  country: countryValidation,
};

const project = {
  project: String,
  country: countryValidation,
  active: Boolean,
  dateActive: {
    type: Date,
    default: Date.now,
  },
  dateInactive: Date,
};

const settingsSchema = new Schema({
  contractors: [contractor],
  packages: [package],
  users: [user],
  projects: [project],
});

const cardSchema = new Schema({
  workerName: {
    type: String,
    validate: {
      validator: namesValidator,
      message: "Worker's name required",
    },
  },
  workerSurname: {
    type: String,
    validate: {
      validator: namesValidator,
      message: "Worker's surname required",
    },
  },
  workerId: String,
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
  ...contractor,
  ...package,
});

const supportedCountries = ["DE", "FR"];

const cardsModels = supportedCountries.reduce((models, country) => {
  models[`Cards${country}`] = mongoose.model(
    `Cards${country}`,
    cardSchema,
    `cards_${country.toLowerCase()}`
  );
  return models;
}, {});

const settingsModels = supportedCountries.reduce((models, country) => {
  models[`Settings${country}`] = mongoose.model(
    `Settings${country}`,
    settingsSchema,
    `settings_${country.toLowerCase()}`
  );
  return models;
}, {});

const Users = mongoose.model("Users", userSchema, "users");

const models = { ...cardsModels, ...settingsModels, Users };

module.exports = models;
