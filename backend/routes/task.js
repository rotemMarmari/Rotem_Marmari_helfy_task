import { Router } from "express";
import validateTask from "../middleware/validation.js";

const taskRoutes = Router();
const tasks = [];

let nextId = 1;

taskRoutes.get("/", async (req, res) => {
  try {
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

taskRoutes.post("/", validateTask, async (req, res) => {
  try {
    const { title, description, completed, priority } = req.body;

    const currentDate = new Date();
    const newTask = {
      id: nextId++,
      title,
      description,
      completed,
      createdAt: currentDate,
      priority,
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

taskRoutes.put("/:id", validateTask, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority } = req.body;
    const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title,
      description,
      completed,
      priority,
    };
    res.status(200).json(tasks[taskIndex]);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

taskRoutes.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }
    const deletedTask = tasks.splice(taskIndex, 1);
    res.status(204).json(deletedTask[0]);
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Server error" });
  }
});

taskRoutes.patch("/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
    const taskIndex = tasks.findIndex((task) => task.id === parseInt(id));
    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }
    tasks[taskIndex].completed = !tasks[taskIndex].completed;
    res.status(200).json(tasks[taskIndex]);
  } catch (error) {
    console.error("Error toggling task completion:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default taskRoutes;
