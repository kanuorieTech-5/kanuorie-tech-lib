require("dotenv").config();

const mongoose = require("mongoose");

(async () => {
  try {
    console.log("Connecting to MongoDB...");
    console.log("URI:", process.env.MONGO_URI.replace(/\/\/(.*?):(.*?)@/, "//***:***@"));

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ Connected successfully!");
    console.log("Host:", mongoose.connection.host);
    console.log("Database:", mongoose.connection.name);

    process.exit(0);
  } catch (err) {
    console.error("❌ Connection failed:");
    console.error(err);
    process.exit(1);
  }
})();