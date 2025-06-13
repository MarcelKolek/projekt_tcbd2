module.exports = {
  HOST: process.env.DB_HOST || "postgres",
  USER: process.env.DB_USER || "postgres",
  PASSWORD: process.env.DB_PASSWORD || "postgres",
  DB: process.env.DB_NAME || "pomodoro_auth",
  dialect: "postgres"
};