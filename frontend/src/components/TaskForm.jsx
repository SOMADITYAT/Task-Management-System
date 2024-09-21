import React, { useState } from "react";
import axios from "axios";

const TaskForm = ({ fetchTasks }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [due, setDue] = useState("");
  const [priority, setPriority] = useState("Normal");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/tasks", {
        title,
        description,
        due,
        priority,
      });
      fetchTasks();
      setTitle("");
      setDescription("");
      setDue("");
      setPriority("Normal");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col bg-white p-4 rounded shadow-md"
    >
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded"
        required
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded"
        required
      />
      <input
        type="date"
        value={due}
        onChange={(e) => setDue(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded"
        required
      />
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        className="mb-2 p-2 border border-gray-300 rounded"
      >
        <option value="Normal">Normal</option>
        <option value="High">High</option>
        <option value="Low">Low</option>
      </select>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
