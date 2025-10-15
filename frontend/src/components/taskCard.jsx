import "../styles/TaskCard.css";
import { useState } from "react";

function TaskCard({ task, onDelete, onToggleCompletion, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedPriority, setEditedPriority] = useState(task.priority);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    try {
      if (!editedTitle || !editedDescription) {
        setErrorMessage("Title and Description cannot be empty.");
        return;
      }
      await onUpdate(task.id, {
        title: editedTitle,
        description: editedDescription,
        priority: editedPriority,
        completed: task.completed,
      });
      setIsEditing(false);
      setErrorMessage("");
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task: " + error.message);
    }
  };

  if (isEditing) {
    return (
      <div className="task-card editing">
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          placeholder="Description"
        />
        <select
          value={editedPriority}
          onChange={(e) => setEditedPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={handleSave}>Save</button>
        <button onClick={() => setIsEditing(false)}>Cancel</button>
        <p className="error-message">{errorMessage}</p>
      </div>
    );
  }

  if (isDeleting) {
    return (
      <div className="task-card deleting">
        <p>Are you sure you want to delete this task?</p>
        <button
          onClick={async () => {
            try {
              await onDelete(task.id);
              setIsDeleting(false);
            } catch (error) {
              console.error("Error deleting task:", error);
              alert("Failed to delete task: " + error.message);
            }
          }}
        >
          Yes
        </button>
        <button onClick={() => setIsDeleting(false)}>No</button>
      </div>
    );
  }

  return (
    <div
      className={`task-card ${task.completed ? "completed" : ""} priority-${
        task.priority
      }`}
    >
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>Priority: {task.priority}</p>
      <p>Created At: {new Date(task.createdAt).toLocaleString()}</p>
      <p>Status: {task.completed ? "Completed" : "Incomplete"}</p>
      <button onClick={() => onToggleCompletion(task.id)}>
        {task.completed ? "Mark Incomplete" : "Mark Complete"}
      </button>
      <button onClick={() => setIsDeleting(true)}>Delete</button>
      <button onClick={() => setIsEditing(true)}>Edit</button>
    </div>
  );
}

export default TaskCard;
