const { Timer } = require("../models");
const { Op } = require("sequelize");

exports.getAllTimers = async (req, res, next) => {
  try {
    const { fromDate, toDate } = req.query;
    const condition = { userId: req.userId };

    if (fromDate || toDate) {
      condition.createdAt = {};
      if (fromDate) condition.createdAt[Op.gte] = new Date(fromDate);
      if (toDate) condition.createdAt[Op.lte] = new Date(toDate);
    }

    const timers = await Timer.findAll({ where: condition });
    res.status(200).send(timers);
  } catch (err) {
    next(err);
  }
};

exports.createTimer = async (req, res, next) => {
  try {
    const { workTime, breakTime, cycles, description } = req.body;
    if (!workTime || !breakTime || !cycles) {
      return res.status(400).send({ message: "Missing timer config" });
    }

    const timer = await Timer.create({
      userId: req.userId,
      workTime,
      breakTime,
      cycles,
      description
    });

    res.status(201).send(timer);
  } catch (err) {
    next(err);
  }
};

exports.updateTimer = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { workTime, breakTime, cycles, description } = req.body;

    const timer = await Timer.findOne({ where: { id, userId: req.userId } });
    if (!timer) return res.status(404).send({ message: "Timer not found." });

    await timer.update({
      workTime,
      breakTime,
      cycles,
      description
    });

    res.status(200).send(timer);
  } catch (err) {
    next(err);
  }
};

exports.deleteTimer = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await Timer.destroy({ where: { id, userId: req.userId } });

    if (!result) {
      return res.status(404).send({ message: "Timer not found." });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
