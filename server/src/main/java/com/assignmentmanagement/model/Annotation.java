package com.assignmentmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "annotations")
public class Annotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id")
    private Submission submission;

    @NotNull
    @Column(name = "page_number")
    private Integer pageNumber;

    @NotNull
    @Column(name = "x_coordinate")
    private Float xCoordinate;

    @NotNull
    @Column(name = "y_coordinate")
    private Float yCoordinate;

    @NotNull
    private Float width;

    @NotNull
    private Float height;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "annotation_type")
    private AnnotationType annotationType;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String color = "#FF0000"; // Default red color

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public Annotation() {}

    public Annotation(Submission submission, Integer pageNumber, Float xCoordinate, 
                     Float yCoordinate, Float width, Float height, 
                     AnnotationType annotationType, String content, User createdBy) {
        this.submission = submission;
        this.pageNumber = pageNumber;
        this.xCoordinate = xCoordinate;
        this.yCoordinate = yCoordinate;
        this.width = width;
        this.height = height;
        this.annotationType = annotationType;
        this.content = content;
        this.createdBy = createdBy;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Lifecycle methods
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
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

    public Submission getSubmission() {
        return submission;
    }

    public void setSubmission(Submission submission) {
        this.submission = submission;
    }

    public Integer getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(Integer pageNumber) {
        this.pageNumber = pageNumber;
    }

    public Float getXCoordinate() {
        return xCoordinate;
    }

    public void setXCoordinate(Float xCoordinate) {
        this.xCoordinate = xCoordinate;
    }

    public Float getYCoordinate() {
        return yCoordinate;
    }

    public void setYCoordinate(Float yCoordinate) {
        this.yCoordinate = yCoordinate;
    }

    public Float getWidth() {
        return width;
    }

    public void setWidth(Float width) {
        this.width = width;
    }

    public Float getHeight() {
        return height;
    }

    public void setHeight(Float height) {
        this.height = height;
    }

    public AnnotationType getAnnotationType() {
        return annotationType;
    }

    public void setAnnotationType(AnnotationType annotationType) {
        this.annotationType = annotationType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
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
}