const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
require("./models/index"); // mongoDB
const taskRoutes = require("./routes/task.routes");
const tagRoutes = require("./routes/tag.routes");
const categoryRoutes = require("./routes/category.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(rateLimit({
  windowMs: 15*60*1000,
  max: 100,
  message: "Too many requests"
}));

app.use("/api/tasks", taskRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/categories", categoryRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Task service running on port ${PORT}`);
});
