import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TaskManager.css";
import config from "../config.js"; // updated path

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({
    id: "",
    text: "",
    time: "",
  });
  const [idToFetch, setIdToFetch] = useState("");
  const [fetchedTask, setFetchedTask] = useState(null);
  const [message, setMessage] = useState("");
  const [editMode, setEditMode] = useState(false);

  const baseUrl = config.url;

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
      setMessage("⚠ Please fill out both Task and Time!");
      return false;
    }
    return true;
  };

  const addTask = async () => {
    if (!validateForm()) return;
    try {
      await axios.post(baseUrl, { text: task.text, time: task.time });
      setMessage("✅ Task added successfully.");
      fetchAllTasks();
      resetForm();
    } catch (error) {
      setMessage("❌ Error adding task.");
    }
  };

  const updateTask = async () => {
    if (!validateForm() || !task.id) return;
    try {
      await axios.put(`${baseUrl}/${task.id}`, {
        text: task.text,
        time: task.time,
      });
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
      setMessage("✅ Task deleted.");
      fetchAllTasks();
    } catch (error) {
      setMessage("❌ Error deleting task.");
    }
  };

  const getTaskById = async () => {
    if (!idToFetch) {
      setMessage("⚠ Please enter a task ID.");
      return;
    }
    try {
      const res = await axios.get(`${baseUrl}/${idToFetch}`);
      setFetchedTask(res.data);
      setMessage("");
    } catch (error) {
      setFetchedTask(null);
      setMessage("❌ Task not found.");
    }
  };

  const handleEdit = (tsk) => {
    setTask(tsk);
    setEditMode(true);
    setMessage(`✏ Editing task with ID ${tsk.id}`);
  };

  const resetForm = () => {
    setTask({
      id: "",
      text: "",
      time: "",
    });
    setEditMode(false);
  };

  return (
    <div className="task-container">
      {message && (
        <div
          className={`message-banner ${
            message.toLowerCase().includes("error") ||
            message.toLowerCase().includes("failed")
              ? "error"
              : "success"
          }`}
        >
          {message}
        </div>
      )}

      <h2>📝 Task Management</h2>

      <div>
        <h3>{editMode ? "Edit Task" : "Add Task"}</h3>
        <div className="form-grid">
          <input
            type="number"
            name="id"
            placeholder="ID"
            value={task.id}
            onChange={handleChange}
            disabled={!editMode}
          />
          <input
            type="text"
            name="text"
            placeholder="Task"
            value={task.text}
            onChange={handleChange}
          />
          <input
            type="time"
            name="time"
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
        </div>
      </div>

      <div>
        <h3>🔍 Get Task By ID</h3>
        <input
          type="number"
          value={idToFetch}
          onChange={(e) => setIdToFetch(e.target.value)}
          placeholder="Enter Task ID"
        />
        <button className="btn-blue" onClick={getTaskById}>
          Fetch
        </button>

        {fetchedTask && (
          <div>
            <h4>Task Found:</h4>
            <pre>{JSON.stringify(fetchedTask, null, 2)}</pre>
          </div>
        )}
      </div>

      <div>
        <h3>📋 All Tasks</h3>
        {tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  {Object.keys(task).map((key) => (
                    <th key={key}>{key}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((tsk) => (
                  <tr key={tsk.id}>
                    {Object.keys(task).map((key) => (
                      <td key={key}>{tsk[key]}</td>
                    ))}
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-green"
                          onClick={() => handleEdit(tsk)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-red"
                          onClick={() => deleteTask(tsk.id)}
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
    </div>
  );
};

export default TaskManager;
