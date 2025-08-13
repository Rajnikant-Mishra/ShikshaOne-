// import dotenv from "dotenv";
// dotenv.config();
// import app from "./app.js";
// import sequelize from "./config/db.js";


// const PORT = process.env.PORT || 8000;

// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("✅ MySQL connected");

//     await sequelize.sync(); // In production, use migrations
//     console.log("✅ All models synchronized");

//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on ${PORT}`);
//     });
//   } catch (error) {
//     console.error("❌ DB connection failed:", error);
//   }
// })();


import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import sequelize from "./config/db.js";

const PORT = process.env.PORT || 8000;

(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ MySQL connected");

    await sequelize.sync(); // In production, use migrations
    console.log("✅ All models synchronized");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("❌ DB connection failed:", error);
  }
})();
