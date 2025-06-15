const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/auth.controller.js");
const router = express.Router();
const { verifyToken, isAdmin } = require("../middleware/authJwt.js");

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

router.get("/users", verifyToken, isAdmin, controller.getAllUsers);
router.put("/users/:id", verifyToken, isAdmin, controller.updateUser);
router.delete("/users/:id", verifyToken, isAdmin, controller.deleteUser);

module.exports = router;
