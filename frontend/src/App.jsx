import React, { useState } from "react";
import TaskList from "./components/TaskList";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [currentTask, setCurrentTask] = useState(null);

  return (
    <div className="container mx-auto p-4">
      <TaskList onEdit={(task) => setCurrentTask(task)} />
      <ToastContainer />
    </div>
  );
};

export default App;
