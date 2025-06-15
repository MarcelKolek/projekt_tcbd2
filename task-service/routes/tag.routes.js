const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/tag.controller.js");
const { verifyToken } = require("../middleware/authJwt.js");
const router = express.Router();

router.get("/", verifyToken, controller.getTags);
router.post("/", verifyToken, [body('name').notEmpty()], controller.createTag);
router.put("/:id", verifyToken, controller.updateTag);
router.delete("/:id", verifyToken, controller.deleteTag);

module.exports = router;
