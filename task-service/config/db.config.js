module.exports = {
  HOST: process.env.MONGO_HOST || "mongo",
  PORT: process.env.MONGO_PORT || 27017,
  DB: process.env.MONGO_DB || "pomodoro_tasks"
};
