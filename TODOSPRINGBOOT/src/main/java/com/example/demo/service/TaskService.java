package com.example.demo.service;



import com.example.demo.entity.*;
import com.example.demo.repo.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskService {
    private final TodoRepository taskRepository;

    public TaskService(TodoRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public Task addTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task updatedTask) {
        return taskRepository.findById(id).map(task -> {
            task.setText(updatedTask.getText());
            task.setTime(updatedTask.getTime());
            return taskRepository.save(task);
        }).orElse(null);
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    public void deleteAllTasks() {
        taskRepository.deleteAll();
    }
}
