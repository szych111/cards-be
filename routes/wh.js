const express = require("express");
const { whDE, whFR } = require("../models/wh-schemas");
const { checkAuth } = require("../util/auth");

const router = express.Router();

const countryWorkingHoursModels = {
  DE: whDE,
  FR: whFR,
};

router.use(checkAuth);

router.get("/:country", async (req, res, next) => {
  const country = req.params.country;

  try {
    const whModel = countryWorkingHoursModels[country];

    if (!whModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    const whData = await whModel.find({}).sort({ from: -1 });

    res.json({ whs: whData });
  } catch (error) {
    next(error);
  }
});

router.post("/:country", async (req, res, next) => {
  const country = req.params.country;
  const newWorkingHours = req.body;

  try {
    const whModel = countryWorkingHoursModels[country];

    if (!whModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    const collectionWH = new whModel(newWorkingHours);

    const savedWH = await collectionWH.save();

    res.status(201).json({
      message: `Working hours saved to collection ${country}`,
      data: savedWH,
    });
    console.log(savedWH);
  } catch (error) {
    next(error);
    console.log(error.message);
  }
});

router.patch("/:country/:id", async (req, res, next) => {
  const country = req.params.country;
  const entryId = req.params.id;
  const entryData = req.body;

  try {
    const whModel = countryWorkingHoursModels[country];

    if (!whModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    await whModel.updateOne({ _id: entryId }, entryData);

    res.json({
      message: `Whs updated in collection ${country}`,
      data: entryData,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:country/:id", async (req, res, next) => {
  const country = req.params.country;
  const entryId = req.params.id;

  try {
    const whModel = countryWorkingHoursModels[country];

    if (!whModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    await whModel.deleteOne({ _id: entryId });

    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
