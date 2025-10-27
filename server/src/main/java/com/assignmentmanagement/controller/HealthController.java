package com.assignmentmanagement.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Value("${spring.application.name:Assignment Management System}")
    private String applicationName;

    @Value("${server.port:8080}")
    private String port;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("application", applicationName);
        healthInfo.put("port", port);
        healthInfo.put("timestamp", LocalDateTime.now());
        healthInfo.put("message", "Assignment Management System is running successfully!");
        
        return ResponseEntity.ok(healthInfo);
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> info() {
        Map<String, Object> appInfo = new HashMap<>();
        appInfo.put("name", applicationName);
        appInfo.put("version", "1.0.0");
        appInfo.put("description", "A comprehensive assignment management system for teachers and students");
        appInfo.put("port", port);
        appInfo.put("features", new String[]{
            "User Authentication (Teachers & Students)",
            "Assignment Management with 5-digit codes",
            "PDF File Upload and Storage",
            "Submission Tracking and Grading",
            "PDF Annotation System",
            "Analytics and Reporting"
        });
        
        return ResponseEntity.ok(appInfo);
    }
}