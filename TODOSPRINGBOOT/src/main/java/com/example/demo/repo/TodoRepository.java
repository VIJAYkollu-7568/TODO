package com.example.demo.repo;


import com.example.demo.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Task, Long>{
	
}