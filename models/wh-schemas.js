const mongoose = require("mongoose");
const { Schema } = mongoose;

const workingHours = {
  project: String,
  from: Date,
  week: Number,
  employees: Number,
  workers: Number,
  total: Number,
  firstAid: Number,
  medicalTreatment: Number,
  minorAccident: Number,
  minorLostDays: Number,
  majorAccident: Number,
  majorLostDays: Number,
  fatal: Number,
  reportableDiseases: Number,
  dangerousOccurrences: Number,
  propertyDamage: Number,
  fireIncidence: Number,
  environmentalIncidents: Number,
  whEmployees: Number,
  whWorkers: Number,
  whTotal: Number,
  LTIFR: Number,
  TRIR: Number,
  SR: Number,
  TOE: Number,
};

const whSchema = new Schema(workingHours);

const whModels = ["DE", "FR"].reduce((models, country) => {
  models[`wh${country}`] = mongoose.model(
    `wh${country}`,
    whSchema,
    `wh_${country.toLowerCase()}`
  );
  return models;
}, {});

const models = { ...whModels };

module.exports = models;
