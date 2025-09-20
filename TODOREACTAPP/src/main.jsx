import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // ⬅️ you're already using this
import "./index.css"; // ⬅️ or replace with your actual CSS file

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
