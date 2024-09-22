import React from "react";

const SortSidebar = ({ sortCriteria, setSortCriteria }) => {
  return (
    <div className="w-64 p-4 bg-gray-100 border-r border-gray-300">
      <h3 className="text-lg font-semibold mb-4">Sort Tasks</h3>

      <div className="mb-4">
        <h4 className="font-medium">Status</h4>
        <select
          onChange={(e) => setSortCriteria((prev) => ({ ...prev, status: e.target.value }))}
          className="border rounded-lg p-2 w-full"
        >
          <option value="">All</option>
          <option value="Completed">Completed</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <div className="mb-4">
        <h4 className="font-medium">Priority</h4>
        <select
          onChange={(e) => setSortCriteria((prev) => ({ ...prev, priority: e.target.value }))}
          className="border rounded-lg p-2 w-full"
        >
          <option value="">All</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="mb-4">
        <h4 className="font-medium">Due Date</h4>
        <select
          onChange={(e) => setSortCriteria((prev) => ({ ...prev, dueDate: e.target.value }))}
          className="border rounded-lg p-2 w-full"
        >
          <option value="">None</option>
          <option value="Ascending">Ascending</option>
          <option value="Descending">Descending</option>
        </select>
      </div>

      <div className="mb-4">
        <h4 className="font-medium">Assignee</h4>
        <select
          onChange={(e) => setSortCriteria((prev) => ({ ...prev, assignee: e.target.value }))}
          className="border rounded-lg p-2 w-full"
        >
          <option value="">All</option>
          <option value="John">John</option>
          <option value="Jane">Jane</option>
        </select>
      </div>
    </div>
  );
};

export default SortSidebar;
