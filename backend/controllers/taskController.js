const Task = require("../models/taskModel");

// Get all tasks
const getTasks = async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
};

// Add a new task
const addTask = async (req, res) => {
  const { title, description } = req.body;
  const task = new Task({ title, description });
  await task.save();
  res.json(task);
};

// Update task
const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  task.status = req.body.status;
  await task.save();
  res.json(task);
};

// Delete task
const deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
};

module.exports = { getTasks, addTask, updateTask, deleteTask };
