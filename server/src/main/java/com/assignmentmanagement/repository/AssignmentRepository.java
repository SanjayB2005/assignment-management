package com.assignmentmanagement.repository;

import com.assignmentmanagement.model.Assignment;
import com.assignmentmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    
    Optional<Assignment> findByAssignmentCode(String assignmentCode);
    
    boolean existsByAssignmentCode(String assignmentCode);
    
    List<Assignment> findByCreatedBy(User createdBy);
    
    List<Assignment> findByCreatedByAndIsActiveTrue(User createdBy);
    
    @Query("SELECT a FROM Assignment a WHERE a.createdBy = :teacher AND a.isActive = true ORDER BY a.createdAt DESC")
    List<Assignment> findActiveAssignmentsByTeacher(@Param("teacher") User teacher);
    
    @Query("SELECT a FROM Assignment a WHERE a.deadline > :currentTime AND a.isActive = true")
    List<Assignment> findActiveAssignments(@Param("currentTime") LocalDateTime currentTime);
    
    @Query("SELECT a FROM Assignment a WHERE a.deadline < :currentTime AND a.isActive = true")
    List<Assignment> findExpiredAssignments(@Param("currentTime") LocalDateTime currentTime);
    
    @Query("SELECT a FROM Assignment a WHERE a.title LIKE %:title% AND a.isActive = true")
    List<Assignment> findByTitleContaining(@Param("title") String title);
    
    @Query("SELECT COUNT(a) FROM Assignment a WHERE a.createdBy = :teacher AND a.isActive = true")
    long countActiveAssignmentsByTeacher(@Param("teacher") User teacher);
    
    @Query("SELECT a FROM Assignment a WHERE a.createdBy = :teacher AND a.deadline BETWEEN :startDate AND :endDate AND a.isActive = true")
    List<Assignment> findAssignmentsByTeacherAndDateRange(
        @Param("teacher") User teacher, 
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate
    );
}