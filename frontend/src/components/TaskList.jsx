import React, { useEffect, useState } from "react";
import { fetchTasks, deleteTask, exportTasks, importTasks } from "../api/api";
import Modal from "./Modal";
import AddTask from "./AddTask";
import EditTask from "./EditTask";
import ReactPaginate from "react-paginate"; // Import react-paginate
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
  const [currentPage, setCurrentPage] = useState(0); // Change to 0 for zero-based index
  const [csvFile, setCsvFile] = useState(null);
  const [error, setError] = useState(null);
  const [fileError, setFileError] = useState("");

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

  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFileError("File size exceeds 5MB.");
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setFileError("");
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await importTasks(formData);
        console.log(response.message);
        const tasksData = await fetchTasks(); // Reload tasks after import
        setTasks(tasksData);
      } catch (error) {
        console.error("Error importing tasks:", error);
      }
    }
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
    currentPage * TASKS_PER_PAGE,
    (currentPage + 1) * TASKS_PER_PAGE
  );

  const handlePageChange = (data) => {
    setCurrentPage(data.selected); // Update the current page
  };

  return (
    <div className="w-100">
      <h2 className="text-2xl mb-4">Task Manager</h2>
      {error && <p className="text-red-500">{error}</p>}
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

      <div className="w-4xl mx-auto bg-white rounded-lg overflow-hidden p-4">
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
                <tr key={task._id}>
                  <td className="px-4 py-3 text-gray-700">
                    {index + 1 + currentPage * TASKS_PER_PAGE}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{task.task}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {task.description}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{task.endDate}</td>
                  <td className="px-4 py-3 text-gray-700">{task.priority}</td>
                  <td className="px-4 py-3 text-gray-700">{task.status}</td>
                  <td className="px-4 py-3 text-gray-700">{task.assignment}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEditTask(task)}
                      className="text-blue-500 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <ReactPaginate
          className="flex items-center text-center justify-center mt-4"
          previousLabel={
            <span className="flex items-center ">
              <FaArrowLeft />
            </span>
          }
          nextLabel={
            <span className="flex items-center">
              <FaArrowRight />
            </span>
          }
          breakLabel={"..."}
          breakClassName={"mx-2"}
          pageCount={totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={handlePageChange}
          containerClassName={"flex justify-center items-center mt-4"}
          pageClassName={"mx-1"}
          pageLinkClassName={
            " rounded hover:bg-blue-500 hover:text-white transition"
          }
          previousClassName={"mx-1"}
          previousLinkClassName={
            " rounded hover:bg-blue-500 hover:text-white transition"
          }
          nextClassName={"mx-1"}
          nextLinkClassName={
            " rounded hover:bg-blue-500 hover:text-white transition"
          }
          activeClassName={"bg-blue-500 text-white"}
        />
      </div>
    </div>
  );
};

export default TaskList;
