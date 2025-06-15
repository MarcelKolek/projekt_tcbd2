const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const db = require("./models");
const authRoutes = require("./routes/auth.routes.js");
const errorHandler = require("./middleware/errorHandler.js");

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests"
}));

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  const MAX_RETRIES = 10;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      await db.sequelize.sync();
      console.log("✅ Database synced successfully.");
      break;
    } catch (err) {
      retries++;
      console.error(`❌ Database sync failed (attempt ${retries}/${MAX_RETRIES})`);
      console.error(err);
      await new Promise(res => setTimeout(res, 3000)); // wait 3s before retrying
    }
  }

  if (retries === MAX_RETRIES) {
    console.error("🚫 Max retries reached. Exiting.");
    process.exit(1);
  }

  app.use("/api/auth", authRoutes);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`🚀 Auth service running on port ${PORT}`);
  });
};

startServer();
