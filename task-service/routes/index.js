const express = require("express");
const app = express();
app.use("/api/tasks", require("./task.routes"));
app.use("/api/tags", require("./tag.routes"));
module.exports = app;