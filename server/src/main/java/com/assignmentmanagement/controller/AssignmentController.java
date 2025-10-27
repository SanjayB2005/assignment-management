package com.assignmentmanagement.controller;

import com.assignmentmanagement.dto.AssignmentRequest;
import com.assignmentmanagement.dto.AssignmentResponse;
import com.assignmentmanagement.model.Assignment;
import com.assignmentmanagement.model.User;
import com.assignmentmanagement.service.AssignmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "http://localhost:5173")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    @PostMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> createAssignment(@Valid @RequestBody AssignmentRequest request, 
                                            Authentication authentication) {
        try {
            User teacher = (User) authentication.getPrincipal();
            
            Assignment assignment = assignmentService.createAssignment(
                request.getTitle(),
                request.getDescription(),
                teacher,
                request.getDeadline(),
                request.getMaxMarks(),
                request.getInstructions()
            );

            return ResponseEntity.ok(new AssignmentResponse(assignment));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error creating assignment: " + e.getMessage()));
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> getTeacherAssignments(Authentication authentication) {
        try {
            User teacher = (User) authentication.getPrincipal();
            List<Assignment> assignments = assignmentService.findAssignmentsByTeacher(teacher);
            
            List<AssignmentResponse> response = assignments.stream()
                .map(AssignmentResponse::new)
                .collect(Collectors.toList());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error fetching assignments: " + e.getMessage()));
        }
    }

    @GetMapping("/search/{code}")
    public ResponseEntity<?> getAssignmentByCode(@PathVariable String code) {
        try {
            if (!assignmentService.isValidAssignmentCode(code)) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Invalid assignment code format"));
            }

            Optional<Assignment> assignment = assignmentService.findByAssignmentCode(code);
            
            if (assignment.isPresent()) {
                return ResponseEntity.ok(new AssignmentResponse(assignment.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error searching assignment: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAssignment(@PathVariable Long id, Authentication authentication) {
        try {
            Optional<Assignment> assignmentOpt = assignmentService.findById(id);
            
            if (assignmentOpt.isPresent()) {
                Assignment assignment = assignmentOpt.get();
                User currentUser = (User) authentication.getPrincipal();
                
                // Check if user has access to this assignment
                if (currentUser.getRole().name().equals("TEACHER") && 
                    !assignment.getCreatedBy().getId().equals(currentUser.getId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("Access denied"));
                }
                
                return ResponseEntity.ok(new AssignmentResponse(assignment));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error fetching assignment: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> updateAssignment(@PathVariable Long id, 
                                            @Valid @RequestBody AssignmentRequest request,
                                            Authentication authentication) {
        try {
            User teacher = (User) authentication.getPrincipal();
            Optional<Assignment> assignmentOpt = assignmentService.findById(id);
            
            if (assignmentOpt.isPresent()) {
                Assignment assignment = assignmentOpt.get();
                
                // Check if teacher owns this assignment
                if (!assignment.getCreatedBy().getId().equals(teacher.getId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("Access denied"));
                }
                
                assignment.setTitle(request.getTitle());
                assignment.setDescription(request.getDescription());
                assignment.setDeadline(request.getDeadline());
                assignment.setMaxMarks(request.getMaxMarks());
                assignment.setInstructions(request.getInstructions());
                
                Assignment updatedAssignment = assignmentService.updateAssignment(assignment);
                return ResponseEntity.ok(new AssignmentResponse(updatedAssignment));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error updating assignment: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id, Authentication authentication) {
        try {
            User teacher = (User) authentication.getPrincipal();
            Optional<Assignment> assignmentOpt = assignmentService.findById(id);
            
            if (assignmentOpt.isPresent()) {
                Assignment assignment = assignmentOpt.get();
                
                // Check if teacher owns this assignment
                if (!assignment.getCreatedBy().getId().equals(teacher.getId())) {
                    return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(new MessageResponse("Access denied"));
                }
                
                assignmentService.deleteAssignment(id);
                return ResponseEntity.ok(new MessageResponse("Assignment deleted successfully"));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error deleting assignment: " + e.getMessage()));
        }
    }

    // Inner class for response messages
    public static class MessageResponse {
        private String message;

        public MessageResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}