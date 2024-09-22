import React, { useEffect, useState } from "react";
import { fetchTasks, deleteTask, exportTasks } from "../api/api";
import Modal from "./Modal";
import AddTask from "./AddTask";
import EditTask from "./EditTask";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const TASKS_PER_PAGE = 10;

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState({
    status: "",
    priority: "",
    dueDate: "",
    assignee: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadTasks = async () => {
      const tasksData = await fetchTasks();
      setTasks(tasksData);
    };
    loadTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleTaskAdded = (newTask) => {
    setTasks([...tasks, newTask]);
    setAddModalOpen(false);
  };

  const handleEditTask = (task) => {
    setCurrentTask(task);
    setEditModalOpen(true);
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(
      tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
    setEditModalOpen(false);
  };

  const handleExport = async () => {
    await exportTasks();
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = sortCriteria.status
      ? task.status === sortCriteria.status
      : true;
    const matchesPriority = sortCriteria.priority
      ? task.priority === sortCriteria.priority
      : true;
    const matchesAssignee = sortCriteria.assignee
      ? task.assignment === sortCriteria.assignee
      : true;

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const sortedTasks = filteredTasks.sort((a, b) => {
    if (sortCriteria.dueDate) {
      const aDate = new Date(a.endDate);
      const bDate = new Date(b.endDate);
      return sortCriteria.dueDate === "Ascending"
        ? aDate - bDate
        : bDate - aDate;
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedTasks.length / TASKS_PER_PAGE);
  const displayedTasks = sortedTasks.slice(
    (currentPage - 1) * TASKS_PER_PAGE,
    currentPage * TASKS_PER_PAGE
  );

  return (
    <div className="w-100">
      <h2 className="text-2xl mb-4">Task Manager</h2>
      <div className="flex flex-col md:flex-row md:justify-between items-center w-full p-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-500 focus:outline-none p-2 mb-4 md:mb-0 w-full md:w-1/2 lg:w-1/3 transition"
        />

        <div className="mb-4 md:mb-0 md:ml-4 w-full md:w-1/3 lg:w-auto">
          <select
            onChange={(e) => {
              const [type, value] = e.target.value.split(":");
              setSortCriteria((prev) => ({ ...prev, [type]: value }));
            }}
            className="border rounded-lg p-2 w-full"
          >
            <option value="">Sort by...</option>
            <optgroup label="Status">
              <option value="status:Completed">Completed</option>
              <option value="status:Pending">Pending</option>
            </optgroup>
            <optgroup label="Priority">
              <option value="priority:High">High</option>
              <option value="priority:Medium">Medium</option>
              <option value="priority:Low">Low</option>
            </optgroup>
            <optgroup label="Due Date">
              <option value="dueDate:Ascending">Ascending</option>
              <option value="dueDate:Descending">Descending</option>
            </optgroup>
            <optgroup label="Assignee">
              <option value="assignee:John">John</option>
              <option value="assignee:Jane">Jane</option>
            </optgroup>
          </select>
        </div>

        <div className="flex flex-col md:flex-row md:items-center mt-4 md:mt-0">
          <button
            onClick={() => setAddModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mb-4 md:mb-0 md:mr-4 transition"
          >
            Add Task
          </button>

          <button
            onClick={handleExport}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            Export Tasks to CSV
          </button>
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
        <AddTask onTaskAdded={handleTaskAdded} existingTasks={tasks} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <EditTask
          task={currentTask}
          onUpdateTask={handleUpdateTask}
          onClose={() => setEditModalOpen(false)}
        />
      </Modal>

      <div className="w-4xl mx-auto bg-white  rounded-lg overflow-hidden p-4">
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full bg-white divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                  #
                </th>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                  Task
                </th>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                  End Date
                </th>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                  Assign
                </th>
                <th className="px-4 py-3 text-left text-gray-600 font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayedTasks.map((task, index) => (
                <tr
                  key={task._id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="px-4 py-4">
                    {(currentPage - 1) * TASKS_PER_PAGE + index + 1}
                  </td>
                  <td className="px-4 py-4">{task.task}</td>
                  <td className="px-4 py-4">{task.description}</td>
                  <td className="px-4 py-4">{task.endDate}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`font-semibold ${
                        task.priority === "High"
                          ? "text-red-600"
                          : task.priority === "Medium"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        task.status === "Completed"
                          ? "bg-green-200 text-green-800"
                          : task.status === "Pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : task.status === "In Progress"
                          ? "bg-blue-200 text-blue-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">{task.assignment}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditTask(task)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50 flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Previous
        </button>
        <span className="self-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded disabled:opacity-50 flex items-center"
        >
          Next
          <FaArrowRight className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default TaskList;
