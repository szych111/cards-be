const express = require("express");
const { CardsDE, CardsFR } = require("../models/schemas");
const { checkAuth } = require("../util/auth");

const router = express.Router();

const countryCardModels = {
  DE: CardsDE,
  FR: CardsFR,
};

router.use(checkAuth);

router.get("/:country", async (req, res, next) => {
  const country = req.params.country;
  // const { page = 1, limit = 50 } = req.query;
  const sorting = {
    eventDate: -1,
    workerSurname: 1,
  };

  try {
    const cardModel = countryCardModels[country];

    if (!cardModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    const cardsData = await cardModel.find({}).sort(sorting);
    //   .skip((page - 1) * limit)
    //   .limit(limit);

    // const totalRecords = await cardModel.countDocuments({});

    res.json({
      cards: cardsData,
      message: `Cards fetched from collection ${country}`,
      // pagination: {
      //   page: Number(page),
      //   limit: Number(limit),
      //   totalRecords,
      //   totalPages: Math.ceil(totalRecords / limit),
      // },
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:country", async (req, res, next) => {
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
    const CardModel = countryCardModels[country];

    if (!CardModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    const collectionCard = new CardModel(newCard);

    const savedCard = await collectionCard.save();

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

router.patch("/:country/:id", async (req, res, next) => {
  const country = req.params.country;
  const cardId = req.params.id;
  const cardData = req.body;

  try {
    const CardModel = countryCardModels[country];

    if (!CardModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    await CardModel.updateOne({ _id: cardId }, cardData);

    res.json({
      message: `Card updated in collection ${country}`,
      card: cardData,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:country/:id", async (req, res, next) => {
  const country = req.params.country;

  try {
    const CardModel = countryCardModels[country];

    if (!CardModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    await CardModel.deleteOne({ _id: req.params.id });

    res.json({ message: `Card deleted in collection ${country}` });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
