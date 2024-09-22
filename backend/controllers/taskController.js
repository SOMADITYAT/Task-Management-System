import Task from "../models/taskModel.js";
import { Parser } from "json2csv";
import fs from "fs";
import path from "path";

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
    // Check for duplicate task
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

    // If all validations pass, save the new task
    const newTask = new Task(req.body);
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Error adding task" });
  }
};

export const updateTask = async (req, res) => {
  try {
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
    const tasks = await Task.find(); // Fetch all tasks
    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(tasks);
    res.header("Content-Type", "text/csv");
    res.attachment("tasks.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error exporting tasks:", error);
    res.status(500).send("Internal Server Error");
  }
};
