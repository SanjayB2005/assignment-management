package com.assignmentmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

public class AssignmentRequest {
    
    @NotBlank
    @Size(max = 255)
    private String title;
    
    private String description;
    
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime deadline;
    
    private Integer maxMarks = 100;
    
    private String instructions;

    // Constructors
    public AssignmentRequest() {}

    public AssignmentRequest(String title, String description, LocalDateTime deadline, 
                           Integer maxMarks, String instructions) {
        this.title = title;
        this.description = description;
        this.deadline = deadline;
        this.maxMarks = maxMarks;
        this.instructions = instructions;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public Integer getMaxMarks() {
        return maxMarks;
    }

    public void setMaxMarks(Integer maxMarks) {
        this.maxMarks = maxMarks;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }
}