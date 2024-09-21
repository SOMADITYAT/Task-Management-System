import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

export const getTasks = () => axios.get(API_URL);
export const addTask = (task) => axios.post(API_URL, task);
export const updateTask = (id, task) => axios.put(`${API_URL}/${id}`, task);
export const deleteTask = (id) => axios.delete(`${API_URL}/${id}`);
export const importTasksFromCSV = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_URL}/import`, formData);
};
export const exportTasksToCSV = () =>
  axios.get(`${API_URL}/export`, { responseType: "blob" });
