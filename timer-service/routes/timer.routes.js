const express = require("express");
const { body } = require("express-validator");
const controller = require("../controllers/timer.controller.js");
const { verifyToken } = require("../middleware/verifyToken.js");
const router = express.Router();

router.get("/", verifyToken, controller.getAllTimers);
router.post("/", verifyToken, [
  body('workTime').isInt({ min:1 }),
  body('breakTime').isInt({ min:1 }),
  body('cycles').isInt({ min:1 })
], controller.createTimer);
router.put("/:id", verifyToken, controller.updateTimer);
router.delete("/:id", verifyToken, controller.deleteTimer);

module.exports = router;
