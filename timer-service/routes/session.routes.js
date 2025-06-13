const express = require("express");
const controller = require("../controllers/session.controller.js");
const { verifyToken } = require("../middleware/verifyToken.js");
const router = express.Router();

router.post("/", verifyToken, controller.createSession);
router.patch("/:id", verifyToken, controller.updateSession);
router.get("/", verifyToken, controller.getSessionHistory);
router.get("/stats", verifyToken, controller.getStats);

module.exports = router;
