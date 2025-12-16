require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const dbString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@yellowredcard.9adjf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
  console.error("❌ ERROR: .env variables are missing or path is incorrect!");
  process.exit(1);
}

const runZeroCleanup = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(dbString);
    console.log("✅ Connected.");

    console.log(`\n--- Pruning Zero Values ---`);

    const fieldsToPrune = [
      "employeesHeadcount",
      "workersHeadcount",
      "reportTotalHeadcount",
      "reportEmployeesWhs",
      "reportWorkersWhs",
      "reportTotalWhrs",
      "reportLtifr",
      "reportTrir",
      "reportSr",
      "reportToe",
      "firstAid",
      "medicalTreatment",
      "minorAccident",
      "minorLostDays",
      "majorAccident",
      "majorLostDays",
      "fatal",
      "reportableDiseases",
      "dangerousOccurrences",
      "propertyDamage",
      "fireIncidence",
      "environmentalIncidents",
      "nearMiss",
    ];

    const targetKey = `wh_de`;

    console.log(`\n--- Cleaning Zeros for ${targetKey} ---`);

    let totalRemoved = 0;

    for (const field of fieldsToPrune) {
      const filter = { [field]: 0 };

      const update = { $unset: { [field]: "" } };

      const result = await mongoose.connection
        .collection(targetKey)
        .updateMany(filter, update);

      if (result.modifiedCount > 0) {
        console.log(
          `   Formatted '${field}': Removed ${result.modifiedCount} zero-values.`
        );
        totalRemoved += result.modifiedCount;
      }
    }

    if (totalRemoved === 0) {
      console.log(`   ✨ No zero values found. Collection is clean.`);
    } else {
      console.log(
        `   🧹 Total fields removed in ${targetKey}: ${totalRemoved}`
      );
    }

    console.log("\n🎉 Zero-Cleanup Script Finished Successfully.");
  } catch (error) {
    console.error("❌ FATAL ERROR:", error);
  } finally {
    console.log("👋 Closing connection...");
    await mongoose.connection.close();
  }
};

runZeroCleanup();
