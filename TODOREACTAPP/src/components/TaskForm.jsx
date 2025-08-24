import React, { useState, useEffect } from "react";
import api from "../apiClient"; // ✅ use custom api client
import "./TaskForm.css";

function TaskForm() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [editId, setEditId] = useState(null);

  // ✅ Fetch tasks on page load
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks"); // ✅ no full URL
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // ✅ Add new task
  const handleAdd = async () => {
    if (!taskInput.trim() || !taskTime) {
      alert("⚠️ Please enter both Task and Time!");
      return;
    }
    try {
      const response = await api.post("/tasks", {
        text: taskInput,
        time: taskTime,
      });
      setTasks([...tasks, response.data]);
      setTaskInput("");
      setTaskTime("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  // ✅ Update task
  const handleUpdate = async () => {
    if (!taskInput.trim() || !taskTime || editId === null) {
      alert("⚠️ Both Task and Time are required to update!");
      return;
    }
    try {
      const response = await api.put(`/tasks/${editId}`, {
        text: taskInput,
        time: taskTime,
      });
      setTasks(
        tasks.map((task) => (task.id === editId ? response.data : task))
      );
      setTaskInput("");
      setTaskTime("");
      setEditId(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // ✅ Delete task
  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // ✅ Edit task (load into input)
  const handleEdit = (task) => {
    setTaskInput(task.text);
    setTaskTime(task.time);
    setEditId(task.id);
  };

  return (
    <div className="todo-container">
      <h1>🎯 To-Do List</h1>

      <input
        type="text"
        placeholder="Enter task..."
        value={taskInput}
        onChange={(e) => setTaskInput(e.target.value)}
        required
      />
      <input
        type="time"
        value={taskTime}
        onChange={(e) => setTaskTime(e.target.value)}
        required
      />

      <div>
        <button onClick={handleAdd}>Add Task</button>
        <button onClick={handleUpdate}>Update Task</button>
        <button onClick={() => setTasks([])}>Clear Local</button>
        <button onClick={fetchTasks}>Refresh List</button>
      </div>

      <ul className="todo-list">
        {tasks.map((task) => (
          <li key={task.id} className="todo-item">
            <span>
              {task.text} <b>({task.time})</b>
            </span>
            <div>
              <button onClick={() => handleEdit(task)}>Edit</button>
              <button onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskForm;
