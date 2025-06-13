const { Session, Timer } = require("../models");

exports.createSession = async (req, res, next) => {
  try {
    const { timerId, taskId } = req.body;
    const timer = await Timer.findOne({ where: { id: timerId, userId: req.userId } });
    if (!timer) return res.status(404).send({ message: "Timer not found." });
    const session = await Session.create({
      timerId,
      userId: req.userId,
      taskId: taskId || null,
      status: "started",
      startTime: new Date()
    });
    res.status(201).send(session);
  } catch (err) { next(err); }
};

exports.updateSession = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const session = await Session.findOne({ where: { id, userId: req.userId } });
    if (!session) return res.status(404).send({ message: "Session not found." });
    session.status = status || session.status;
    if (status === "stopped") {
      session.endTime = new Date();
    }
    await session.save();
    res.status(200).send(session);
  } catch (err) { next(err); }
};

exports.getSessionHistory = async (req, res, next) => {
  try {
    const { timerId } = req.query;
    const condition = { userId: req.userId };
    if (timerId) condition.timerId = timerId;
    const sessions = await Session.findAll({ where: condition });
    res.status(200).send(sessions);
  } catch (err) { next(err); }
};

exports.getStats = async (req, res, next) => {
  try {
    const sessions = await Session.findAll({
      where: { userId: req.userId, status: "stopped" }
    });
    let totalTime = 0;
    sessions.forEach(sess => {
      if (sess.endTime && sess.startTime) {
        totalTime += (new Date(sess.endTime) - new Date(sess.startTime));
      }
    });
    res.status(200).send({
      totalTime: Math.floor(totalTime / 1000), // sekundy
      completedSessions: sessions.length
    });
  } catch (err) { next(err); }
};
