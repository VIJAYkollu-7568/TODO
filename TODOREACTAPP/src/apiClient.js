import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // will use the .env value
});

export default api;
