const express = require("express");

const Cards = require("../models/schemas");
const { checkAuth } = require("../util/auth");

const router = express.Router();

router.use(checkAuth);

router.get("/cards", async (req, res, next) => {
  try {
    const cardsData = await Cards.find({}).sort({
      eventDate: -1,
      workerSurname: 1,
    });
    res.json({ cards: cardsData });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const card = await Cards.findById(req.params.id).exec();
    res.json({ card: card });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  console.log(req.token);
  const data = req.body;

  try {
    const newCard = new Cards({
      contractor: data.contractor,
      contractorPerson: data.contractorPerson,
      contractorPhone: data.contractorPhone,
      contractorEmail: data.contractorEmail,
      workerName: data.workerName,
      workerSurname: data.workerSurname,
      workerId: data.workerId,
      package: data.package,
      packageNumber: data.packageNumber,
      packageManager: data.packageManager,
      packagePhone: data.packagePhone,
      packageEmail: data.packageEmail,
      deviations: data.deviations,
      colour: data.colour,
      daysOffSite: data.daysOffSite,
      eventDate: data.eventDate,
      reinductionDate: data.reinductionDate,
      pending: data.pending,
      issuer: data.issuer,
      notes: data.notes,
    });
    const savedCard = await newCard.save();
    res.status(201).json({
      message: "Card saved.",
      card: savedCard,
      // card: newCard.toObject({ getters: true }),
    });
    console.log(savedCard);
  } catch (error) {
    next(error);
    console.log(error.message);
  }
});

router.patch("/:id", async (req, res, next) => {
  const data = req.body;

  let errors = {};

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Updating the card failed due to validation errors.",
      errors,
    });
  }

  try {
    await Cards.updateOne({ _id: req.params.id }, data);
    res.json({ message: "Card updated.", card: data });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Cards.deleteOne({ _id: req.params.id });
    res.json({ message: "Card deleted." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
