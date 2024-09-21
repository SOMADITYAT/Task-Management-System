import Task from "../models/taskModel.js";
import { Parser } from "json2csv";
import csv from "csv-parser";
import fs from "fs";
import multer from "multer";

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new task
const addTask = async (req, res) => {
  const { title, description, due, priority, status, assignedUsers } = req.body;

  const newTask = new Task({
    title,
    description,
    due,
    priority,
    status: status || "Pending",
    assignedUsers,
  });

  try {
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a task
const updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    Object.assign(task, req.body); // Update fields
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    await task.remove();
    res.json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Import tasks from CSV
const importTasksFromCSV = (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", async () => {
      for (const taskData of results) {
        const newTask = new Task(taskData);
        try {
          await newTask.save();
        } catch (error) {
          console.error(`Failed to save task: ${error.message}`);
        }
      }
      res.status(201).json({ message: "Tasks imported successfully" });
      fs.unlink(req.file.path, (err) => {
        if (err) console.error(`Failed to delete file: ${err.message}`);
      });
    });
};

// Export tasks to CSV
const exportTasksToCSV = async (req, res) => {
  try {
    const tasks = await Task.find();
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(tasks);
    res.header("Content-Type", "text/csv");
    res.attachment("tasks.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  importTasksFromCSV,
  exportTasksToCSV,
  upload,
};
