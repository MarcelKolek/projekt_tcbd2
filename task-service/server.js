const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/task.routes.js");
const tagRoutes = require("./routes/tag.routes.js");
const errorHandler = require("./middleware/errorHandler.js");
const dbConfig = require("./config/db.config.js");

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(rateLimit({
  windowMs: 15*60*1000,
  max: 100,
  message: "Too many requests"
}));

mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use("/api/tasks", taskRoutes);
app.use("/api/tags", tagRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Task service running on port ${PORT}`);
});
