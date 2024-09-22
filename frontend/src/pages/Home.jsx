import React, { useEffect, useState } from "react";
import { getTasks, deleteTask, updateTask } from "../api/api";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskAdd";
import TaskImport from "../components/TaskImport";

const Home = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const response = await getTasks();
    setTasks(response.data);
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const handleSave = async (task) => {
    if (editingTask) {
      await updateTask(editingTask._id, task);
    } else {
      await addTask(task);
    }
    setEditingTask(null);
    fetchTasks();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl mb-4">Task Manager</h1>
      <TaskImport />
      <TaskForm
        task={editingTask}
        onSave={handleSave}
        onCancel={() => setEditingTask(null)}
      />
      <TaskList tasks={tasks} onDelete={handleDelete} onEdit={handleEdit} />
    </div>
  );
};

export default Home;
