const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/auth.controller.js");
const router = express.Router();

router.post(
  "/register",
  [body('username').notEmpty(), body('password').isLength({ min: 4 })],
  controller.register
);
router.post(
  "/login",
  [body('username').notEmpty(), body('password').notEmpty()],
  controller.login
);

module.exports = router;
