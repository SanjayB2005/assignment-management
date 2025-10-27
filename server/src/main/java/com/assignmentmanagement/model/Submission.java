package com.assignmentmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "submissions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"assignment_id", "student_id"})
})
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id")
    @JsonIgnore
    private Assignment assignment;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id")
    @JsonIgnore
    private User student;

    @NotBlank
    @Column(name = "file_path", length = 500)
    private String filePath;

    @NotBlank
    @Column(name = "original_filename")
    private String originalFilename;

    @NotNull
    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Enumerated(EnumType.STRING)
    private SubmissionStatus status = SubmissionStatus.UPLOADED;

    @Column(name = "marks_obtained")
    private Integer marksObtained;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    @Column(name = "corrected_file_path", length = 500)
    private String correctedFilePath;

    @Column(name = "corrected_filename")
    private String correctedFilename;

    @Column(name = "graded_at")
    private LocalDateTime gradedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "graded_by")
    @JsonIgnore
    private User gradedBy;

    @Column(name = "is_late_submission")
    private Boolean isLateSubmission = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "submission", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Annotation> annotations;

    // Constructors
    public Submission() {}

    public Submission(Assignment assignment, User student, String filePath, 
                     String originalFilename, Long fileSize) {
        this.assignment = assignment;
        this.student = student;
        this.filePath = filePath;
        this.originalFilename = originalFilename;
        this.fileSize = fileSize;
        this.submittedAt = LocalDateTime.now();
        this.isLateSubmission = LocalDateTime.now().isAfter(assignment.getDeadline());
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Lifecycle methods
    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (submittedAt == null) {
            submittedAt = LocalDateTime.now();
        }
        updatedAt = LocalDateTime.now();
        
        // Check if submission is late
        if (assignment != null && assignment.getDeadline() != null) {
            isLateSubmission = submittedAt.isAfter(assignment.getDeadline());
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Assignment getAssignment() {
        return assignment;
    }

    public void setAssignment(Assignment assignment) {
        this.assignment = assignment;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getOriginalFilename() {
        return originalFilename;
    }

    public void setOriginalFilename(String originalFilename) {
        this.originalFilename = originalFilename;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public SubmissionStatus getStatus() {
        return status;
    }

    public void setStatus(SubmissionStatus status) {
        this.status = status;
    }

    public Integer getMarksObtained() {
        return marksObtained;
    }

    public void setMarksObtained(Integer marksObtained) {
        this.marksObtained = marksObtained;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public String getCorrectedFilePath() {
        return correctedFilePath;
    }

    public void setCorrectedFilePath(String correctedFilePath) {
        this.correctedFilePath = correctedFilePath;
    }

    public String getCorrectedFilename() {
        return correctedFilename;
    }

    public void setCorrectedFilename(String correctedFilename) {
        this.correctedFilename = correctedFilename;
    }

    public LocalDateTime getGradedAt() {
        return gradedAt;
    }

    public void setGradedAt(LocalDateTime gradedAt) {
        this.gradedAt = gradedAt;
    }

    public User getGradedBy() {
        return gradedBy;
    }

    public void setGradedBy(User gradedBy) {
        this.gradedBy = gradedBy;
    }

    public Boolean getIsLateSubmission() {
        return isLateSubmission;
    }

    public void setIsLateSubmission(Boolean isLateSubmission) {
        this.isLateSubmission = isLateSubmission;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<Annotation> getAnnotations() {
        return annotations;
    }

    public void setAnnotations(List<Annotation> annotations) {
        this.annotations = annotations;
    }

    // Helper methods
    public boolean isGraded() {
        return marksObtained != null && gradedAt != null;
    }

    public String getFileSizeFormatted() {
        if (fileSize == null) return "0 KB";
        
        long bytes = fileSize;
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024) + " KB";
        return (bytes / (1024 * 1024)) + " MB";
    }

    // Custom getters for JSON serialization to avoid circular references
    @JsonProperty("assignmentId")
    public Long getAssignmentId() {
        return assignment != null ? assignment.getId() : null;
    }

    @JsonProperty("assignmentTitle")
    public String getAssignmentTitle() {
        return assignment != null ? assignment.getTitle() : null;
    }

    @JsonProperty("assignmentCode")
    public String getAssignmentCode() {
        return assignment != null ? assignment.getAssignmentCode() : null;
    }

    @JsonProperty("studentId")
    public Long getStudentId() {
        return student != null ? student.getId() : null;
    }

    @JsonProperty("studentName")
    public String getStudentName() {
        return student != null ? student.getFirstName() + " " + student.getLastName() : null;
    }

    @JsonProperty("studentEmail")
    public String getStudentEmail() {
        return student != null ? student.getEmail() : null;
    }

    @JsonProperty("assignmentMaxMarks")
    public Integer getAssignmentMaxMarks() {
        return assignment != null ? assignment.getMaxMarks() : null;
    }

    @JsonProperty("assignment")
    public AssignmentInfo getAssignmentInfo() {
        if (assignment != null) {
            return new AssignmentInfo(assignment.getId(), assignment.getTitle(), assignment.getAssignmentCode(), assignment.getMaxMarks());
        }
        return null;
    }

    @JsonProperty("gradedByName")
    public String getGradedByName() {
        return gradedBy != null ? gradedBy.getFirstName() + " " + gradedBy.getLastName() : null;
    }

    // Inner class for safe assignment info
    public static class AssignmentInfo {
        private Long id;
        private String title;
        private String assignmentCode;
        private Integer maxMarks;

        public AssignmentInfo(Long id, String title, String assignmentCode, Integer maxMarks) {
            this.id = id;
            this.title = title;
            this.assignmentCode = assignmentCode;
            this.maxMarks = maxMarks;
        }

        public Long getId() { return id; }
        public String getTitle() { return title; }
        public String getAssignmentCode() { return assignmentCode; }
        public Integer getMaxMarks() { return maxMarks; }
    }
}