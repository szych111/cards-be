const mongoose = require("mongoose");
const { Schema } = mongoose;

const workingHours = {
  project: String,
  from: Date,
  reportWeek: Number,
  employeesHeadcount: Number,
  workersHeadcount: Number,
  reportTotalHeadcount: Number,
  firstAid: { type: Number, required: false },
  medicalTreatment: { type: Number, required: false },
  minorAccident: { type: Number, required: false },
  majorAccident: { type: Number, required: false },
  majorLostDays: { type: Number, required: false },
  fatal: { type: Number, required: false },
  reportableDiseases: { type: Number, required: false },
  dangerousOccurrences: { type: Number, required: false },
  propertyDamage: { type: Number, required: false },
  fireIncidence: { type: Number, required: false },
  environmentalIncidents: { type: Number, required: false },
  nearMiss: { type: Number, required: false },
  reportEmployeesWhs: { type: Number, required: false },
  reportWorkersWhs: { type: Number, required: false },
  reportTotalWhrs: { type: Number, required: false },
  reportLtifr: { type: Number, required: false },
  reportTrir: { type: Number, required: false },
  reportSr: { type: Number, required: false },
  reportToe: { type: Number, required: false },
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
