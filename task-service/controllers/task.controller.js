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
    const { title, description, tagIds } = req.body;
    const task = new Task({
      title,
      description,
      userId: req.userId,
      tags: tagIds || []
    });
    await task.save();
    res.status(201).send(task);
  } catch (err) { next(err); }
};

exports.updateTask = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { title, description, status, tagIds } = req.body;
    const task = await Task.findOne({ _id: id, userId: req.userId });
    if (!task) return res.status(404).send({ message: "Task not found." });
    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (tagIds) task.tags = tagIds;
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
