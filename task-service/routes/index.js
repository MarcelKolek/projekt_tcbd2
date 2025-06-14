const express = require("express");
const app = express();
app.use("/api/tasks", require("./task.routes"));
app.use("/api/tags", require("./tag.routes"));
app.use("/api/categories", require("./category.routes"));
module.exports = app;