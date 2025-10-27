package com.assignmentmanagement.service;

import com.assignmentmanagement.model.Assignment;
import com.assignmentmanagement.model.User;
import com.assignmentmanagement.repository.AssignmentRepository;
import com.assignmentmanagement.util.AssignmentCodeGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private AssignmentCodeGenerator codeGenerator;

    public Assignment createAssignment(String title, String description, User createdBy, 
                                     LocalDateTime deadline, Integer maxMarks, String instructions) {
        
        // Generate unique assignment code
        String assignmentCode;
        do {
            assignmentCode = codeGenerator.generateCode();
        } while (assignmentRepository.existsByAssignmentCode(assignmentCode));

        Assignment assignment = new Assignment(title, description, assignmentCode, 
                                             createdBy, deadline, maxMarks, instructions);
        return assignmentRepository.save(assignment);
    }

    public Optional<Assignment> findById(Long id) {
        return assignmentRepository.findById(id);
    }

    public Optional<Assignment> findByAssignmentCode(String code) {
        return assignmentRepository.findByAssignmentCode(code);
    }

    public List<Assignment> findAssignmentsByTeacher(User teacher) {
        return assignmentRepository.findActiveAssignmentsByTeacher(teacher);
    }

    public List<Assignment> findActiveAssignments() {
        return assignmentRepository.findActiveAssignments(LocalDateTime.now());
    }

    public List<Assignment> findExpiredAssignments() {
        return assignmentRepository.findExpiredAssignments(LocalDateTime.now());
    }

    public Assignment updateAssignment(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    public void deleteAssignment(Long id) {
        Optional<Assignment> assignmentOpt = assignmentRepository.findById(id);
        if (assignmentOpt.isPresent()) {
            Assignment assignment = assignmentOpt.get();
            assignment.setIsActive(false);
            assignmentRepository.save(assignment);
        }
    }

    public List<Assignment> searchAssignmentsByTitle(String title) {
        return assignmentRepository.findByTitleContaining(title);
    }

    public long getAssignmentCountByTeacher(User teacher) {
        return assignmentRepository.countActiveAssignmentsByTeacher(teacher);
    }

    public List<Assignment> findAssignmentsByTeacherAndDateRange(User teacher, 
                                                               LocalDateTime startDate, 
                                                               LocalDateTime endDate) {
        return assignmentRepository.findAssignmentsByTeacherAndDateRange(teacher, startDate, endDate);
    }

    public boolean canStudentAccessAssignment(Assignment assignment) {
        return assignment.getIsActive() && !assignment.isExpired();
    }

    public boolean canStudentSubmit(Assignment assignment) {
        return assignment.getIsActive() && LocalDateTime.now().isBefore(assignment.getDeadline());
    }

    /**
     * Generates a new unique assignment code
     * @return String containing a unique 5-digit alphanumeric code
     */
    public String generateUniqueCode() {
        String code;
        do {
            code = codeGenerator.generateCode();
        } while (assignmentRepository.existsByAssignmentCode(code));
        return code;
    }

    /**
     * Validates assignment code format
     * @param code the code to validate
     * @return true if valid format, false otherwise
     */
    public boolean isValidAssignmentCode(String code) {
        return codeGenerator.isValidCode(code);
    }
}