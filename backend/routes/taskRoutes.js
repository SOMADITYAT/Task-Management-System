import express from "express";
import { 
  getTasks, 
  addTask, 
  updateTask, 
  deleteTask, 
  importTasksFromCSV, 
  exportTasksToCSV, 
  upload 
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", getTasks);
router.post("/", addTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.post("/import", upload.single("file"), importTasksFromCSV);
router.get("/export", exportTasksToCSV);

export default router;
