const bcrypt = require("bcrypt");
const User = require("../models/User");

const getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const existing = await User.findByEmail(email);
  if (existing) return res.status(400).json({ message: "Email already used" });

  const hashed = await bcrypt.hash(password, 10);
  const newUser = await User.create(name, email, hashed, role);
  res.status(201).json(newUser);
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;
  const updated = await User.update(id, name, email, role);
  res.json(updated);
};

const deleteUser = async (req, res) => {
  await User.delete(req.params.id);
  res.json({ message: "User deleted" });
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
