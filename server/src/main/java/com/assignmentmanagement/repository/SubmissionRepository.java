package com.assignmentmanagement.repository;

import com.assignmentmanagement.model.Assignment;
import com.assignmentmanagement.model.Submission;
import com.assignmentmanagement.model.SubmissionStatus;
import com.assignmentmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    
    Optional<Submission> findByAssignmentAndStudent(Assignment assignment, User student);
    
    List<Submission> findByAssignment(Assignment assignment);
    
    List<Submission> findByStudent(User student);
    
    List<Submission> findByStatus(SubmissionStatus status);
    
    List<Submission> findByAssignmentAndStatus(Assignment assignment, SubmissionStatus status);
    
    @Query("SELECT s FROM Submission s WHERE s.assignment = :assignment ORDER BY s.submittedAt ASC")
    List<Submission> findByAssignmentOrderBySubmittedAt(@Param("assignment") Assignment assignment);
    
    @Query("SELECT s FROM Submission s WHERE s.student = :student ORDER BY s.submittedAt DESC")
    List<Submission> findByStudentOrderBySubmittedAtDesc(@Param("student") User student);
    
    @Query("SELECT s FROM Submission s WHERE s.assignment.createdBy = :teacher ORDER BY s.submittedAt DESC")
    List<Submission> findSubmissionsByTeacher(@Param("teacher") User teacher);
    
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.assignment = :assignment")
    long countSubmissionsByAssignment(@Param("assignment") Assignment assignment);
    
    @Query("SELECT COUNT(s) FROM Submission s WHERE s.assignment = :assignment AND s.status = :status")
    long countSubmissionsByAssignmentAndStatus(@Param("assignment") Assignment assignment, @Param("status") SubmissionStatus status);
    
    @Query("SELECT s FROM Submission s WHERE s.assignment.createdBy = :teacher AND s.submittedAt BETWEEN :startDate AND :endDate")
    List<Submission> findSubmissionsByTeacherAndDateRange(
        @Param("teacher") User teacher, 
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT AVG(s.marksObtained) FROM Submission s WHERE s.assignment = :assignment AND s.marksObtained IS NOT NULL")
    Double getAverageMarksByAssignment(@Param("assignment") Assignment assignment);
    
    @Query("SELECT AVG(s.marksObtained) FROM Submission s WHERE s.student = :student AND s.marksObtained IS NOT NULL")
    Double getAverageMarksByStudent(@Param("student") User student);
    
    @Query("SELECT s FROM Submission s WHERE s.isLateSubmission = true AND s.assignment.createdBy = :teacher")
    List<Submission> findLateSubmissionsByTeacher(@Param("teacher") User teacher);
    
    boolean existsByAssignmentAndStudent(Assignment assignment, User student);
}