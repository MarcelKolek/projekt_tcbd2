const { Timer } = require("../models");
const { Op } = require("sequelize");
const axios = require("axios");

const TASK_SERVICE_URL = process.env.TASK_SERVICE_URL || "http://localhost:4002/api";

exports.getAllTimers = async (req, res, next) => {
  try {
    const timers = await Timer.findAll({ where: { userId: req.userId } });

    const timersWithTags = await Promise.all(
      timers.map(async timer => {
        const tagRes = await axios.get(`${TASK_SERVICE_URL}/tags`, {
            headers: { authorization: req.headers.authorization }
        });
        const tags = tagRes.data.filter(tag => tag.timerIds.includes(timer.id));
        return {
          ...timer.get({ plain: true }), // ✅ safe Sequelize-to-POJO conversion
          tags
        };
      })
    );

    res.status(200).send(timersWithTags);
  } catch (err) {
    console.error("getAllTimers error:", err); // ✅ Log to see actual error server-side
    next(err);
  }
};


exports.createTimer = async (req, res, next) => {
  try {
    const { workTime, breakTime, cycles, description, tagIds = [] } = req.body;

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

    if (tagIds.length > 0) {
      await Promise.all(
        tagIds.map(tagId =>
            axios.put(`${TASK_SERVICE_URL}/tags/${tagId}/attach`, 
            { timerId: timer.id }, 
            { headers: { authorization: req.headers.authorization } }
            )
        )
      );
    }

    res.status(201).send(timer);
  } catch (err) {
    next(err);
  }
};

exports.updateTimer = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { workTime, breakTime, cycles, description, tagIds = [] } = req.body;

    const timer = await Timer.findOne({ where: { id, userId: req.userId } });
    if (!timer) return res.status(404).send({ message: "Timer not found." });

    await timer.update({
      workTime,
      breakTime,
      cycles,
      description
    });

    
    await axios.put(`${TASK_SERVICE_URL}/tags/detach-timer/${id}`, null, {
        headers: { authorization: req.headers.authorization }
    });

    if (tagIds.length > 0) {
      await Promise.all(
        tagIds.map(tagId =>
            axios.put(`${TASK_SERVICE_URL}/tags/${tagId}/attach`, 
            { timerId: id }, 
            { headers: { authorization: req.headers.authorization } }
            )
        )
      );

    }

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
