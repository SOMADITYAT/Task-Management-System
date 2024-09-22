import express from "express";
import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  exportTasks,
  importTasks,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/tasks", getTasks);
router.post("/tasks", addTask);
router.put("/tasks/:id", updateTask);
router.delete("/tasks/:id", deleteTask);
router.get("/export", exportTasks);
router.post("/import", importTasks);

export default router;
