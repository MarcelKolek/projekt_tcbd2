const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const db = require("./models");
const timerRoutes = require("./routes/timer.routes.js");
const sessionRoutes = require("./routes/session.routes.js");
const errorHandler = require("./middleware/errorHandler.js");

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(rateLimit({
  windowMs: 15*60*1000,
  max: 100,
  message: "Too many requests"
}));

db.sequelize.sync();

app.use("/api/timers", timerRoutes);
app.use("/api/sessions", sessionRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Timer service running on port ${PORT}`);
});
