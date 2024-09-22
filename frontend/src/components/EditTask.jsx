import React, { useEffect, useState } from "react";
import { updateTask } from "../api/api";

const EditTask = ({ task, onUpdateTask, onClose }) => {
  const [taskData, setTaskData] = useState(task);

  useEffect(() => {
    setTaskData(task);
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedTask = await updateTask(task._id, taskData);
    onUpdateTask(updatedTask);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl mb-4 text-gray-700">Edit Task</h2>

    <div className="grid grid-cols-1 gap-4">
      <div>
        <input
          name="task"
          value={taskData.task}
          onChange={handleChange}
          required
          placeholder="Task"
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

      <div>
        <input
          name="endDate"
          type="date"
          value={taskData.endDate}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="relative flex items-center">
        <select
          name="priority"
          value={taskData.priority}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="relative flex items-center">
        <select
          name="status"
          value={taskData.status}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div>
        <input
          name="assignment"
          value={taskData.assignment}
          onChange={handleChange}
          required
          placeholder="Assignment"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>
    </div>

    <button
      type="submit"
      className="w-full mt-6 bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-200"
    >
      Update Task
    </button>
  </form>
  );
};

export default EditTask;
