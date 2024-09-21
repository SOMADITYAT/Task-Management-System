import React, { useState } from "react";
import { importTasksFromCSV } from "../api/api";

const TaskImport = () => {
  const [file, setFile] = useState(null);

  const handleImport = async () => {
    if (!file) return alert("Please select a CSV file.");
    try {
      await importTasksFromCSV(file);
      alert("Tasks imported successfully!");
    } catch (error) {
      alert("Error importing tasks.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl mb-4">Import Tasks from CSV</h2>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])}
        className="border p-2 mb-2"
      />
      <button
        onClick={handleImport}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Import
      </button>
    </div>
  );
};

export default TaskImport;
