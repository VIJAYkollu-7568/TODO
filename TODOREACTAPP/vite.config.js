const config = {
  url:
    import.meta.env.VITE_API_BASE ||
    "http://localhost:8080/todospringboot/api/tasks", // ✅ ends with /tasks
};

export default config;
