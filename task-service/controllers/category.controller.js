const Category = require("../models/category.model");

exports.getCategories = async (req, res, next) => {
  try {
    const cats = await Category.find({ userId: req.userId });
    res.status(200).send(cats);
  } catch (err) { next(err); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const cat = new Category({ name, userId: req.userId });
    await cat.save();
    res.status(201).send(cat);
  } catch (err) { next(err); }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { name } = req.body;
    const cat = await Category.findOne({ _id: id, userId: req.userId });
    if (!cat) return res.status(404).send({ message: "Category not found." });
    if (name) cat.name = name;
    await cat.save();
    res.status(200).send(cat);
  } catch (err) { next(err); }
};
