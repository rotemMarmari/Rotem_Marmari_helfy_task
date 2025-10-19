import { useState, useEffect } from "react";
import "./App.css";
import {
  fetchTasks,
  addTask,
  deleteTask,
  updateTask,
  toggleTaskCompletion,
} from "./services/api";
import TaskCard from "./components/taskCard";

function App() {
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("all");

  useEffect(() => {
    const getTasks = async () => {
      try {
        const response = await fetchTasks();
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    getTasks();
  }, []);

  const createTask = (title, description, priority) => ({
    title,
    description,
    completed: false,
    priority,
  });

  const handleAddTask = async (e) => {
    e.preventDefault();
    const title = e.target.elements[0].value;
    const description = e.target.elements[1].value;
    const priority = e.target.elements[2].value;

    if (!title || !description) {
      setErrorMessage("Title and Description cannot be empty.");
      return;
    }

    const newTask = createTask(title, description, priority);
    try {
      const response = await addTask(newTask);
      setTasks([...tasks, response.data]);
      setErrorMessage("");
      e.target.reset();
    } catch (error) {
      setErrorMessage(error.message || "Error adding task");
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleToggleCompletion = async (id) => {
    try {
      const response = await toggleTaskCompletion(id);
      setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const handleUpdateTask = async (id, updatedTask) => {
    try {
      const response = await updateTask(id, updatedTask);
      if (response.data) {
        setTasks(tasks.map((task) => (task.id === id ? response.data : task)));
        return true;
      } else {
        throw new Error("No data received from server");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSelectedFilter(newFilter);
  };

  return (
    <div>
      <div className="header">
        <h1 className="title">Task Manager</h1>
      </div>
      <h2 id="new-task-header">Add New Task</h2>
      <div className="add-task-form">
        <form onSubmit={handleAddTask}>
          <input type="text" placeholder="Title" />
          <input type="text" placeholder="Description" />
          <select>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button id="add-task-button" type="submit">
            Add Task
          </button>
          <p className="error-message">{errorMessage}</p>
        </form>
      </div>
      <div className="filter-buttons">
        <button
          className={`filter-button ${filter === "all" ? "active" : ""}`}
          onClick={() => handleFilterChange("all")}
        >
          All
        </button>
        <button
          className={`filter-button ${filter === "completed" ? "active" : ""}`}
          onClick={() => handleFilterChange("completed")}
        >
          Completed
        </button>
        <button
          className={`filter-button ${filter === "incomplete" ? "active" : ""}`}
          onClick={() => handleFilterChange("incomplete")}
        >
          Incomplete
        </button>
      </div>
      <div className="control-buttons">
        <button
          onClick={() =>
            setTasks((prev) => [prev.at(-1), ...prev.slice(0, -1)])
          }
        >
          ←
        </button>
        <button onClick={() => setTasks((prev) => [...prev.slice(1), prev[0]])}>
          →
        </button>
      </div>
      <div className="task-list">
        <ul>
          {tasks
            .filter((task) => {
              if (filter === "completed") return task.completed;
              if (filter === "incomplete") return !task.completed;
              return true; // "all"
            })
            .map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDeleteTask}
                onToggleCompletion={handleToggleCompletion}
                onUpdate={handleUpdateTask}
              />
            ))}
        </ul>
        <ul aria-hidden="true">
          {tasks
            .filter((task) => {
              if (filter === "completed") return task.completed;
              if (filter === "incomplete") return !task.completed;
              return true; // "all"
            })
            .map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={handleDeleteTask}
                onToggleCompletion={handleToggleCompletion}
                onUpdate={handleUpdateTask}
              />
            ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
