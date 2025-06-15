const Tag = require("../models/tag.model");

exports.getTags = async (req, res, next) => {
  try {
    const tags = await Tag.find({ userId: req.userId });
    res.status(200).send(tags);
  } catch (err) { next(err); }
};

exports.createTag = async (req, res, next) => {
  try {
    const { name } = req.body;
    const tag = new Tag({ name, userId: req.userId });
    await tag.save();
    res.status(201).send(tag);
  } catch (err) { next(err); }
};

exports.updateTag = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    const tag = await Tag.findOne({ _id: id, userId: req.userId });
    if (!tag) return res.status(404).send({ message: "Tag not found." });
    if (name) tag.name = name;
    await tag.save();
    res.status(200).send(tag);
  } catch (err) { next(err); }
};

exports.deleteTag = async (req, res, next) => {
  try {
    const id = req.params.id;
    const tag = await Tag.findOneAndDelete({ _id: id, userId: req.userId });
    if (!tag) return res.status(404).send({ message: "Tag not found." });
    res.status(200).send({ message: "Tag deleted successfully." });
  } catch (err) {
    next(err);
  }
};
