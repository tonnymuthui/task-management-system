const Task = require("../models/Task");
const User = require("../models/User");
const sendEmail = require("../utils/mailer");

const getAllTasks = async (req, res) => {
  const tasks = await Task.findAll();
  res.json(tasks);
};

const getMyTasks = async (req, res) => {
  const tasks = await Task.findByUser(req.user.id);
  res.json(tasks);
};

const assignTask = async (req, res) => {
  const { name, userEmail, deadline } = req.body;
  const user = await User.findByEmail(userEmail);
  if (!user) return res.status(404).json({ message: "User not found" });

  const task = await Task.create(name, user.id, deadline);

  await sendEmail(user.email, "New Task Assigned", `Task: ${name}\nDeadline: ${deadline}`);
  res.status(201).json(task);
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updated = await Task.updateStatus(id, status);
  res.json(updated);
};

module.exports = { getAllTasks, getMyTasks, assignTask, updateStatus };
