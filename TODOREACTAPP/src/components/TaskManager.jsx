import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import config from "./config.js";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({
    text: "",
    time: "",
  });
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const baseUrl = `${config.url}/api/tasks`;

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      const res = await axios.get(baseUrl);
      setTasks(res.data);
    } catch (error) {
      setMessage("❌ Failed to fetch tasks.");
    }
  };

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!task.text.trim() || !task.time.trim()) {
      setMessage("⚠️ Please fill out all fields.");
      return false;
    }
    return true;
  };

  const addTask = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(baseUrl, task);
      setMessage("✅ Task added successfully.");
      fetchAllTasks();
      resetForm();
    } catch (error) {
      setMessage("❌ Error adding task.");
    }
  };

  const updateTask = async () => {
    if (!validateForm()) return;
    try {
      await axios.put(`${baseUrl}/${editId}`, task);
      setMessage("✅ Task updated successfully.");
      fetchAllTasks();
      resetForm();
    } catch (error) {
      setMessage("❌ Error updating task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${baseUrl}/${id}`);
      setMessage("🗑️ Task deleted.");
      fetchAllTasks();
    } catch (error) {
      setMessage("❌ Error deleting task.");
    }
  };

  const deleteAllTasks = async () => {
    try {
      await axios.delete(baseUrl);
      setMessage("🗑️ All tasks deleted.");
      fetchAllTasks();
    } catch (error) {
      setMessage("❌ Error deleting all tasks.");
    }
  };

  const handleEdit = (t) => {
    setTask({ text: t.text, time: t.time });
    setEditMode(true);
    setEditId(t.id);
    setMessage(`✏️ Editing task with ID ${t.id}`);
  };

  const resetForm = () => {
    setTask({ text: "", time: "" });
    setEditMode(false);
    setEditId(null);
  };

  return (
    <div className="task-container">
      {message && (
        <div
          className={`message-banner ${
            message.includes("❌") ? "error" : "success"
          }`}
        >
          {message}
        </div>
      )}

      <h2>Task Manager</h2>

      <div className="form-grid">
        <input
          type="text"
          name="text"
          placeholder="Task text"
          value={task.text}
          onChange={handleChange}
        />
        <input
          type="text"
          name="time"
          placeholder="Task time"
          value={task.time}
          onChange={handleChange}
        />
      </div>

      <div className="btn-group">
        {!editMode ? (
          <button className="btn-blue" onClick={addTask}>
            Add Task
          </button>
        ) : (
          <>
            <button className="btn-green" onClick={updateTask}>
              Update Task
            </button>
            <button className="btn-gray" onClick={resetForm}>
              Cancel
            </button>
          </>
        )}
        <button className="btn-red" onClick={deleteAllTasks}>
          Delete All
        </button>
      </div>

      <h3>All Tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Text</th>
                <th>Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.text}</td>
                  <td>{t.time}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-green"
                        onClick={() => handleEdit(t)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-red"
                        onClick={() => deleteTask(t.id)}
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
      )}
    </div>
  );
};

export default TaskManager;
