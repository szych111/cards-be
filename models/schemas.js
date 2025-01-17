const mongoose = require("mongoose");
const { Schema } = mongoose;

const cardSchema = new Schema({
  contractor: { type: String, required: [true, "Contractor's name required"] },
  contractorPerson: String,
  contractorPhone: String,
  contractorEmail: {
    type: String,
    lowercase: true,
    validate: {
      validator: function (v) {
        return !v || !v.trim().length || /^\S+@\S+\.\S+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  workerName: {
    type: String,
    required: [true, "Worker's name required"],
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
  eventDate: { type: Date, default: Date.now },
  reinductionDate: Date,
  pending: { type: Boolean, default: true },
  issuer: String,
});

cardSchema.methods.close = function () {
  this.pending = false;
};

const Cards = mongoose.model("Cards", cardSchema, "cards");

module.exports = Cards;
