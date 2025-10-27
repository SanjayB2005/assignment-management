package com.assignmentmanagement.repository;

import com.assignmentmanagement.model.Annotation;
import com.assignmentmanagement.model.AnnotationType;
import com.assignmentmanagement.model.Submission;
import com.assignmentmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnotationRepository extends JpaRepository<Annotation, Long> {
    
    List<Annotation> findBySubmission(Submission submission);
    
    List<Annotation> findBySubmissionAndPageNumber(Submission submission, Integer pageNumber);
    
    List<Annotation> findBySubmissionAndAnnotationType(Submission submission, AnnotationType annotationType);
    
    List<Annotation> findByCreatedBy(User createdBy);
    
    @Query("SELECT a FROM Annotation a WHERE a.submission = :submission ORDER BY a.pageNumber ASC, a.yCoordinate ASC")
    List<Annotation> findBySubmissionOrderByPageAndPosition(@Param("submission") Submission submission);
    
    @Query("SELECT COUNT(a) FROM Annotation a WHERE a.submission = :submission")
    long countAnnotationsBySubmission(@Param("submission") Submission submission);
    
    @Query("SELECT COUNT(a) FROM Annotation a WHERE a.submission = :submission AND a.annotationType = :type")
    long countAnnotationsBySubmissionAndType(@Param("submission") Submission submission, @Param("type") AnnotationType type);
    
    void deleteBySubmission(Submission submission);
}