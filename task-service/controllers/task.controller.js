const Task = require("../models/task.model");
const Tag = require("../models/tag.model");

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.userId }).populate("tags");
    res.status(200).send(tasks);
  } catch (err) { next(err); }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, tagIds, timerIds } = req.body;
    const task = new Task({
      title,
      description,
      tags: tagIds || [],
      timerIds: timerIds || [],
      userId: req.userId
    });
    await task.save();
    res.status(201).send(task);
  } catch (err) { next(err); }
};

exports.updateTask = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { title, description, status, tagIds, timerIds } = req.body;
    const task = await Task.findOne({ _id: id, userId: req.userId });
    if (!task) return res.status(404).send({ message: "Task not found." });

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (tagIds) task.tags = tagIds;
    if (timerIds) task.timerIds = timerIds;

    await task.save();
    res.status(200).send(task);
  } catch (err) { next(err); }
};

exports.getTask = async (req, res, next) => {
  try {
    const id = req.params.id;
    const task = await Task.findOne({ _id: id, userId: req.userId }).populate("tags");
    if (!task) return res.status(404).send({ message: "Task not found." });
    res.status(200).send(task);
  } catch (err) { next(err); }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const id = req.params.id;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.userId });
    if (!task) return res.status(404).send({ message: "Task not found." });
    res.status(200).send({ message: "Task deleted successfully." });
  } catch (err) {
    next(err);
  }
};
