const express = require("express");
const { SettingsDE, SettingsFR } = require("../models/schemas");
const { checkAuth } = require("../util/auth");

const router = express.Router();

const countrySettingsModels = {
  DE: SettingsDE,
  FR: SettingsFR,
};

router.use(checkAuth);

router.get("/:country", async (req, res, next) => {
  const country = req.params.country;

  try {
    const settingsModel = countrySettingsModels[country];

    if (!settingsModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    const settingsData = await settingsModel.findOne({});

    res.json(settingsData);
  } catch (error) {
    next(error);
  }
});

router.post("/:country/contractors", async (req, res, next) => {
  const country = req.params.country;
  const newContractor = req.body;

  try {
    const settingsModel = countrySettingsModels[country];

    if (!settingsModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    const updatedSettings = await settingsModel.findOneAndUpdate(
      {},
      { $push: { contractors: newContractor } },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: "Contractor added successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:country/packages", async (req, res, next) => {
  const country = req.params.country;
  const newPackage = req.body;

  try {
    const settingsModel = countrySettingsModels[country];

    if (!settingsModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    const updatedSettings = await settingsModel.findOneAndUpdate(
      {},
      { $push: { packages: newPackage } },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: "Package added successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:country/users", async (req, res, next) => {
  const country = req.params.country;
  const newUser = req.body;

  try {
    const settingsModel = countrySettingsModels[country];

    if (!settingsModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    const updatedSettings = await settingsModel.findOneAndUpdate(
      {},
      { $push: { users: newUser } },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: "User added successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/:country/projects", async (req, res, next) => {
  const country = req.params.country;
  const newProject = req.body;

  try {
    const settingsModel = countrySettingsModels[country];

    if (!settingsModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    const updatedSettings = await settingsModel.findOneAndUpdate(
      {},
      { $push: { projects: newProject } },
      { new: true, upsert: true }
    );

    res.status(201).json({
      message: "Project added successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:country/contractors/:id", async (req, res, next) => {
  const country = req.params.country;
  const contractorId = req.params.id;
  const updatedData = req.body;

  try {
    const settingsModel = countrySettingsModels[country];

    if (!settingsModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    const updatedSettings = await settingsModel.findOneAndUpdate(
      { "contractors._id": contractorId },
      { $set: { "contractors.$": updatedData } },
      { new: true }
    );

    if (!updatedSettings) {
      return res.status(404).json({ message: "Contractor not found" });
    }

    res.json({
      message: "Contractor updated successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:country/packages/:id", async (req, res, next) => {
  const country = req.params.country;
  const packageId = req.params.id;
  const updatedData = req.body;

  try {
    const settingsModel = countrySettingsModels[country];

    if (!settingsModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    const updatedSettings = await settingsModel.findOneAndUpdate(
      { "packages._id": packageId },
      { $set: { "packages.$": updatedData } },
      { new: true }
    );

    if (!updatedSettings) {
      return res.status(404).json({ message: "Package not found" });
    }

    res.json({
      message: "Package updated successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:country/users/:id", async (req, res, next) => {
  const country = req.params.country;
  const userId = req.params.id;
  const updatedData = req.body;

  try {
    const settingsModel = countrySettingsModels[country];

    if (!settingsModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    const updatedSettings = await settingsModel.findOneAndUpdate(
      { "users._id": userId },
      { $set: { "users.$": updatedData } },
      { new: true }
    );

    if (!updatedSettings) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    next(error);
  }
});

router.patch("/:country/projects/:id", async (req, res, next) => {
  const country = req.params.country;
  const projectId = req.params.id;
  const updatedData = req.body;

  try {
    const settingsModel = countrySettingsModels[country];

    if (!settingsModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    const updatedSettings = await settingsModel.findOneAndUpdate(
      { "projects._id": projectId },
      { $set: { "projects.$": updatedData } },
      { new: true }
    );

    if (!updatedSettings) {
      return res.status(404).json({ message: "project not found" });
    }

    res.json({
      message: "project updated successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:country/contractors/:id", async (req, res, next) => {
  const country = req.params.country;
  const contractorId = req.params.id;

  try {
    const settingsModel = countrySettingsModels[country];

    if (!settingsModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    const updatedSettings = await settingsModel.findOneAndUpdate(
      {},
      { $pull: { contractors: { _id: contractorId } } },
      { new: true }
    );

    if (!updatedSettings) {
      return res.status(404).json({ message: "Settings document not found" });
    }

    res.json({
      message: "Contractor deleted successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:country/packages/:id", async (req, res, next) => {
  const country = req.params.country;
  const packageId = req.params.id;

  try {
    const settingsModel = countrySettingsModels[country];

    if (!settingsModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    const updatedSettings = await settingsModel.findOneAndUpdate(
      {},
      { $pull: { packages: { _id: packageId } } },
      { new: true }
    );

    if (!updatedSettings) {
      return res.status(404).json({ message: "Settings document not found" });
    }

    res.json({
      message: "Package deleted successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:country/users/:id", async (req, res, next) => {
  const country = req.params.country;
  const userId = req.params.id;

  try {
    const settingsModel = countrySettingsModels[country];

    if (!settingsModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    const updatedSettings = await settingsModel.findOneAndUpdate(
      {},
      { $pull: { users: { _id: userId } } },
      { new: true }
    );

    if (!updatedSettings) {
      return res.status(404).json({ message: "Settings document not found" });
    }

    res.json({
      message: "User deleted successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:country/projects/:id", async (req, res, next) => {
  const country = req.params.country;
  const projectId = req.params.id;

  try {
    const settingsModel = countrySettingsModels[country];

    if (!settingsModel) {
      throw new Error(`Unsupported country: ${country}`);
    }

    const updatedSettings = await settingsModel.findOneAndUpdate(
      {},
      { $pull: { projects: { _id: projectId } } },
      { new: true }
    );

    if (!updatedSettings) {
      return res.status(404).json({ message: "Settings document not found" });
    }

    res.json({
      message: "Project deleted successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
