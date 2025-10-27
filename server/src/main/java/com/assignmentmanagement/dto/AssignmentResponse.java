package com.assignmentmanagement.dto;

import com.assignmentmanagement.model.Assignment;

import java.time.LocalDateTime;

public class AssignmentResponse {
    
    private Long id;
    private String title;
    private String description;
    private String assignmentCode;
    private String createdByName;
    private Long createdById;
    private LocalDateTime deadline;
    private Integer maxMarks;
    private String instructions;
    private LocalDateTime createdAt;
    private boolean isExpired;
    private long submissionCount;

    // Constructors
    public AssignmentResponse() {}

    public AssignmentResponse(Assignment assignment) {
        this.id = assignment.getId();
        this.title = assignment.getTitle();
        this.description = assignment.getDescription();
        this.assignmentCode = assignment.getAssignmentCode();
        this.createdByName = assignment.getCreatedBy().getFullName();
        this.createdById = assignment.getCreatedBy().getId();
        this.deadline = assignment.getDeadline();
        this.maxMarks = assignment.getMaxMarks();
        this.instructions = assignment.getInstructions();
        this.createdAt = assignment.getCreatedAt();
        this.isExpired = assignment.isExpired();
        this.submissionCount = assignment.getSubmissionCount();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getAssignmentCode() {
        return assignmentCode;
    }

    public void setAssignmentCode(String assignmentCode) {
        this.assignmentCode = assignmentCode;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isExpired() {
        return isExpired;
    }

    public void setExpired(boolean expired) {
        isExpired = expired;
    }

    public long getSubmissionCount() {
        return submissionCount;
    }

    public void setSubmissionCount(long submissionCount) {
        this.submissionCount = submissionCount;
    }
}