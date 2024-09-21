import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    due: { type: Date, required: true },
    priority: { type: String, default: "Medium" },
    status: { type: String, default: "Pending" },
    assignedUsers: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
