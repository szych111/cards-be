const { Cards } = require("../models/schemas");

Cards.updateMany({}, { $set: { project: "CloudHQ  GER1", country: "DE" } })
  .then((res) => {
    console.log(`${res.modifiedCount} documents updated.`);
  })
  .catch((err) => {
    console.error("Error updating documents:", err);
  });
