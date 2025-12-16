require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");

const dbString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@yellowredcard.9adjf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

if (!process.env.DB_USER || !process.env.DB_PASSWORD) {
  console.error("❌ ERROR: .env variables are missing or path is incorrect!");
  process.exit(1);
}

const runRenamingMigration = async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(dbString);
    console.log("✅ Connected.");

    const renameUpdates = {
      reportEmployeesWhs: "reportEmployeesWhrs",
      reportWorkersWhs: "reportWorkersWhrs",
    };

    const targetKey = `wh_de`;

    console.log(`\n--- Processing ${targetKey} ---`);

    const result = await mongoose.connection
      .collection(targetKey)
      .updateMany({}, { $rename: renameUpdates });

    console.log(`✅ Renaming Complete:`);
    console.log(`   - Documents Matched: ${result.matchedCount}`);
    console.log(`   - Documents Modified: ${result.modifiedCount}`);
  } catch (error) {
    console.error("❌ FATAL ERROR:", error);
  } finally {
    console.log("👋 Closing connection...");
    await mongoose.connection.close();
  }
};

runRenamingMigration();
