import React, { useState } from "react";
import { createTask } from "../api/api";
import { toast } from "react-toastify";

const AddTask = ({ onTaskAdded, existingTasks }) => {
  const [taskData, setTaskData] = useState({
    task: "",
    description: "",
    endDate: "",
    priority: "Low",
    status: "Pending",
    assignment: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setTaskData({ ...taskData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const isDuplicate = existingTasks.some(
      (existingTask) =>
        existingTask.task.toLowerCase() === taskData.task.toLowerCase()
    );
    if (isDuplicate) {
      setError("Task with this title already exists.");
      toast.error("Task with this title already exists."); // Show error toast
      return;
    }

    // Validate: Check that the due date is not in the past
    const dueDate = new Date(taskData.endDate);
    const today = new Date();
    if (dueDate < today) {
      setError("Due date cannot be in the past.");
      toast.error("Due date cannot be in the past."); // Show error toast
      return;
    }

    try {
      const newTask = await createTask(taskData);
      onTaskAdded(newTask);
      setTaskData({
        task: "",
        description: "",
        endDate: "",
        priority: "Low",
        status: "Pending",
        assignment: "",
      });
      toast.success("Task added successfully!"); // Show success toast
    } catch (err) {
      setError("Failed to create task. Please try again.");
      toast.error("Failed to create task. Please try again."); // Show error toast
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-700 text-center">
        Add Task
      </h2>

      {error && <div className="mb-4 text-red-500">{error}</div>}

      <div className="grid grid-cols-1 gap-4">
        <div>
          <input
            name="task"
            value={taskData.task}
            onChange={handleChange}
            placeholder="Task"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div>
          <input
            name="description"
            value={taskData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="relative flex items-center">
            <div
              onClick={() => document.getElementById("date-picker").focus()}
              className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer hover:bg-gray-200 rounded-md transition duration-200"
            >
              <svg
                className="w-4 h-4 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
              </svg>
            </div>
            <input
              id="date-picker"
              name="endDate"
              type="date"
              value={taskData.endDate}
              onChange={handleChange}
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Select date"
            />
          </div>

          <div className="relative flex items-center">
            <div
              onClick={() => document.getElementById("priority-select").focus()}
              className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer hover:bg-gray-200 rounded-md transition duration-200"
            >
              <svg
                className="w-4 h-4 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M5 3a1 1 0 0 1 1 1v1h8V4a1 1 0 1 1 2 0v1h1a1 1 0 0 1 0 2h-1v8a1 1 0 0 1-2 0v-1H6v1a1 1 0 0 1-2 0V6H3a1 1 0 0 1 0-2h1V4a1 1 0 0 1 1-1Z" />
              </svg>
            </div>
            <select
              id="priority-select"
              name="priority"
              value={taskData.priority}
              onChange={handleChange}
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="relative flex items-center">
            <div
              onClick={() => document.getElementById("status-select").focus()}
              className="absolute inset-y-0 left-0 flex items-center pl-3 cursor-pointer hover:bg-gray-200 rounded-md transition duration-200"
            >
              <svg
                className="w-4 h-4 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M11.293 8.293 8.586 11H16a1 1 0 1 1 0 2H8.586l2.707 2.707a1 1 0 0 1-1.414 1.414l-5-5a1 1 0 0 1 0-1.414l5-5a1 1 0 0 1 1.414 1.414Z" />
              </svg>
            </div>
            <select
              id="status-select"
              name="status"
              value={taskData.status}
              onChange={handleChange}
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <input
            name="assignment"
            value={taskData.assignment}
            onChange={handleChange}
            placeholder="Assignment"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full mt-6 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-200"
      >
        Add Task
      </button>
    </form>
  );
};

export default AddTask;
