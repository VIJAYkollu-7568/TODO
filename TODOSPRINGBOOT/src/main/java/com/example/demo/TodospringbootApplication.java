package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class TodospringbootApplication extends SpringBootServletInitializer {

    public static void main(String[] args) {
        SpringApplication.run(TodospringbootApplication.class, args);
    }

    // This makes WAR deploy work in Tomcat
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(TodospringbootApplication.class);
    }
}
