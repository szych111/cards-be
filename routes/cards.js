const express = require("express");
const {
  Cards,
  CardsDE,
  CardsFR,
  CardsIT,
  CardsUK,
} = require("../models/schemas");
const { checkAuth } = require("../util/auth");
const { fbAuthUser } = require("../util/fb-auth");

const router = express.Router();

// Define the lookup table for country-specific card models ONCE
const countryCardModels = {
  DE: CardsDE,
  FR: CardsFR,
  IT: CardsIT,
  UK: CardsUK,
};

// GET all cards for a specific country
router.get("/:country", fbAuthUser, async (req, res, next) => {
  const country = req.params.country;
  const sorting = {
    eventDate: -1,
    workerSurname: 1,
  };

  try {
    // Get the appropriate model based on the country
    const cardModel = countryCardModels[country];

    if (!cardModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    // Fetch and sort the data
    const cardsData = await cardModel.find({}).sort(sorting);

    // Send the response
    res.json({ cards: cardsData, message: "You are authorized!" });
  } catch (error) {
    next(error);
  }
});

// GET a specific card by ID
router.get("/:id", fbAuthUser, async (req, res, next) => {
  try {
    const card = await Cards.findById(req.params.id).exec();
    res.json({ card: card });
  } catch (error) {
    next(error);
  }
});

// POST a new card for a specific country
router.post("/:country", fbAuthUser, async (req, res, next) => {
  const country = req.params.country;
  const data = req.body;
  const newCard = {
    contractor: data.contractor,
    contractorPerson: data.contractorPerson,
    contractorPhone: data.contractorPhone,
    contractorEmail: data.contractorEmail,
    country: data.country,
    workerName: data.workerName,
    workerSurname: data.workerSurname,
    workerId: data.workerId,
    package: data.package,
    packageNumber: data.packageNumber,
    packageManager: data.packageManager,
    packagePhone: data.packagePhone,
    packageEmail: data.packageEmail,
    project: data.project,
    deviations: data.deviations,
    colour: data.colour,
    daysOffSite: data.daysOffSite,
    eventDate: data.eventDate,
    reinductionDate: data.reinductionDate,
    pending: data.pending,
    issuer: data.issuer,
    notes: data.notes,
  };

  try {
    // Get the appropriate model based on the country
    const CardModel = countryCardModels[country];

    if (!CardModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    // Create a new card instance for the specified country
    const collectionCard = new CardModel(newCard);

    // Save the card to the database
    const savedCard = await collectionCard.save();

    // Send the response
    res.status(201).json({
      message: `Card saved to collection ${country}`,
      card: savedCard,
    });
    console.log(savedCard);
  } catch (error) {
    next(error);
    console.log(error.message);
  }
});

// PATCH (update) a card for a specific country
router.patch("/:country/:id", fbAuthUser, async (req, res, next) => {
  const cardData = req.body;
  const country = req.params.country;

  let errors = {};

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Updating the card failed due to validation errors.",
      errors,
    });
  }

  try {
    // Get the appropriate model based on the country
    const CardModel = countryCardModels[country];

    if (!CardModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    // Update the card
    await CardModel.updateOne({ _id: req.params.id }, cardData);

    res.json({
      message: `Card updated in collection ${country}`,
      card: cardData,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE a card for a specific country
router.delete("/:country/:id", fbAuthUser, async (req, res, next) => {
  const country = req.params.country;

  try {
    // Get the appropriate model based on the country
    const CardModel = countryCardModels[country];

    if (!CardModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    // Delete the card
    await CardModel.deleteOne({ _id: req.params.id });

    res.json({ message: `Card deleted in collection ${country}` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
