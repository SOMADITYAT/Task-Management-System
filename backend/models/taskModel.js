import mongoose, { get } from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    task: { type: String, required: true },
    description: { type: String },
    endDate: { type: Date, get: (date) => date.toISOString().split("T")[0] },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    assignment: { type: String, required: true },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
