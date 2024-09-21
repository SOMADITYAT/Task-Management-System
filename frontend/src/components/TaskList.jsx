import React from "react";
import { deleteTask } from "../api/api";

const TaskList = ({ tasks, setCurrentTask, fetchTasks }) => {
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmed) {
      await deleteTask(id);
      fetchTasks();
    }
  };

  return (
    <ul className="space-y-4">
      {tasks.map((task) => (
        <li key={task._id} className="border rounded-md p-4">
          <h3 className="text-lg font-semibold">{task.taskTitle}</h3>
          <p>Status: {task.status}</p>
          <p>Assignee: {task.assignee}</p>
          <p>Start Date: {new Date(task.startDate).toLocaleDateString()}</p>
          <p>End Date: {new Date(task.endDate).toLocaleDateString()}</p>
          <div className="mt-4 space-x-2">
            <button
              onClick={() => setCurrentTask(task)}
              className="bg-yellow-500 text-white rounded-md px-2 py-1"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(task._id)}
              className="bg-red-500 text-white rounded-md px-2 py-1"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
