package com.assignmentmanagement.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class GradeSubmissionRequest {
    
    @NotNull
    @Min(0)
    @Max(100)
    private Integer marks;
    
    private String feedback;

    // Constructors
    public GradeSubmissionRequest() {}

    public GradeSubmissionRequest(Integer marks, String feedback) {
        this.marks = marks;
        this.feedback = feedback;
    }

    // Getters and Setters
    public Integer getMarks() {
        return marks;
    }

    public void setMarks(Integer marks) {
        this.marks = marks;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}