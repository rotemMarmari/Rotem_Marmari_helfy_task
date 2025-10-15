import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

export const fetchTasks = () => api.get("/tasks");
export const addTask = (task) => api.post("/tasks", task);
export const updateTask = (id, task) => api.put(`/tasks/${id}`, task);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
export const toggleTaskCompletion = (id) => api.patch(`/tasks/${id}/toggle`);

export default api;
