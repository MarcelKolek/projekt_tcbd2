const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/category.controller.js");
const { verifyToken } = require("../middleware/authJwt.js");
const router = express.Router();

router.get("/", verifyToken, controller.getCategories);
router.post("/", verifyToken, [body('name').notEmpty()], controller.createCategory);
router.put("/:id", verifyToken, controller.updateCategory);

module.exports = router;