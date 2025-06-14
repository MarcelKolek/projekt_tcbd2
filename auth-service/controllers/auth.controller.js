const db = require("../models");
const User = db.user;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

exports.register = async (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).send({ message: "Username and password required" });
    }
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res.status(400).send({ message: "Username already in use!" });
    }
    const hashedPassword = bcrypt.hashSync(password, 8);
    await User.create({
      username,
      password: hashedPassword,
      role: role || "user",
      preferences: {}
    });
    res.status(201).send({ message: "User registered successfully!" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({ message: "Invalid Password!" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, config.secret, {
      expiresIn: 86400 // 24h
    });
    res.status(200).send({
      id: user.id,
      username: user.username,
      role: user.role,
      accessToken: token
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: ['id','username','role','preferences'] });
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { role, preferences } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    if (role) user.role = role;
    if (preferences) user.preferences = preferences;
    await user.save();
    res.status(200).send({ id: user.id, username: user.username, role: user.role });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await User.destroy({ where: { id } });
    if (!result) {
      return res.status(404).send({ message: "User not found." });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

exports.updatePreferences = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    user.preferences = { ...user.preferences, ...req.body };
    await user.save();
    res.status(200).send(user.preferences);
  } catch (err) {
    next(err);
  }
};
