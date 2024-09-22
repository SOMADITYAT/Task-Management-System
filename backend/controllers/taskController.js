import Task from "../models/taskModel.js";
import { Parser } from "json2csv";
import fs from "fs";
import path from "path";
// const upload = multer({ dest: "uploads/" });

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const addTask = async (req, res) => {
  const { task, endDate } = req.body;

  try {
    const existingTask = await Task.findOne({ task });
    if (existingTask) {
      return res.status(400).json({ message: "Task already exists." });
    }

    // Validate due date
    const dueDate = new Date(endDate);
    if (dueDate < new Date()) {
      return res
        .status(400)
        .json({ message: "Due date cannot be in the past." });
    }

    req.body.endDate = new Date(dueDate.toISOString().split("T")[0]);

    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error adding task" });
  }
};

export const updateTask = async (req, res) => {
  try {
    if (req.body.endDate) {
      const dueDate = new Date(req.body.endDate);
      req.body.endDate = new Date(dueDate.toISOString().split("T")[0]);
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
};
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export const exportTasks = async (req, res) => {
  try {
    const tasks = await Task.find();

    const formattedTasks = tasks.map((task) => ({
      ...task._doc,
      endDate: task.endDate ? task.endDate.split("T")[0] : null,
    }));

    const json2csvParser = new Parser(formattedTasks);
    const csv = json2csvParser.parse(tasks);
    res.header("Content-Type", "text/csv");
    res.attachment("tasks.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting tasks:", error);
    res.status(500).send("Internal Server Error");
  }
};
export const importTasks = async (req, res) => {
  const tasks = [];
  const filePath = path.join(__dirname, "../uploads/tasks.csv"); // Adjust the path as needed

  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (row) => {
      tasks.push(row);
    })
    .on("end", async () => {
      try {
        for (const task of tasks) {
          // Convert endDate to ISO format if necessary
          task.endDate = new Date(task.endDate);
          const newTask = new Task(task);
          await newTask.save();
        }
        res.status(201).json({ message: "Tasks imported successfully", tasks });
      } catch (error) {
        console.error("Error importing tasks:", error);
        res.status(500).json({ message: "Error importing tasks" });
      }
    })
    .on("error", (error) => {
      console.error("CSV reading error:", error);
      res.status(500).json({ message: "Error reading CSV file" });
    });
};
