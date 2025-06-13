const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/task.controller.js");
const { verifyToken } = require("../middleware/authJwt.js");
const router = express.Router();

router.get("/", verifyToken, controller.getTasks);
router.post("/", verifyToken, [body('title').notEmpty()], controller.createTask);
router.get("/:id", verifyToken, controller.getTask);
router.put("/:id", verifyToken, controller.updateTask);

module.exports = router;
