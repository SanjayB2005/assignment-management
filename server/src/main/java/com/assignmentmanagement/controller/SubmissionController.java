package com.assignmentmanagement.controller;

import com.assignmentmanagement.dto.GradeSubmissionRequest;
import com.assignmentmanagement.model.*;
import com.assignmentmanagement.service.AssignmentService;
import com.assignmentmanagement.service.FileStorageService;
import com.assignmentmanagement.service.SubmissionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController 
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "http://localhost:5173")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> uploadSubmission(@RequestParam("file") MultipartFile file,
                                            @RequestParam("assignmentCode") String assignmentCode,
                                            Authentication authentication) {
        try {
            User student = (User) authentication.getPrincipal();
            
            // Validate assignment code and get assignment
            Optional<Assignment> assignmentOpt = assignmentService.findByAssignmentCode(assignmentCode);
            if (assignmentOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Assignment not found with code: " + assignmentCode));
            }

            Assignment assignment = assignmentOpt.get();
            
            // Check if student can submit
            if (!submissionService.canStudentSubmit(assignment, student)) {
                if (assignment.isExpired()) {
                    return ResponseEntity.badRequest()
                        .body(new MessageResponse("Assignment deadline has passed"));
                } else {
                    return ResponseEntity.badRequest()
                        .body(new MessageResponse("You have already submitted for this assignment"));
                }
            }

            // Store file
            String filePath = fileStorageService.storeFile(file, assignmentCode, student.getEmail());
            
            // Create submission record
            Submission submission = submissionService.createSubmission(
                assignment, student, filePath, file.getOriginalFilename(), file.getSize()
            );

            Map<String, Object> response = new HashMap<>();
            response.put("message", "File uploaded successfully");
            response.put("submissionId", submission.getId());
            response.put("fileName", file.getOriginalFilename());
            response.put("fileSize", file.getSize());
            response.put("isLateSubmission", submission.getIsLateSubmission());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error uploading file: " + e.getMessage()));
        }
    }

    @GetMapping("/assignment/{assignmentId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> getSubmissionsByAssignment(@PathVariable Long assignmentId, 
                                                       Authentication authentication) {
        try {
            User teacher = (User) authentication.getPrincipal();
            Optional<Assignment> assignmentOpt = assignmentService.findById(assignmentId);
            
            if (assignmentOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Assignment assignment = assignmentOpt.get();
            
            // Check if teacher owns this assignment
            if (!assignment.getCreatedBy().getId().equals(teacher.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Access denied"));
            }

            List<Submission> submissions = submissionService.findSubmissionsByAssignment(assignment);
            return ResponseEntity.ok(submissions);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error fetching submissions: " + e.getMessage()));
        }
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getStudentSubmissions(Authentication authentication) {
        try {
            User student = (User) authentication.getPrincipal();
            List<Submission> submissions = submissionService.findSubmissionsByStudent(student);
            return ResponseEntity.ok(submissions);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error fetching submissions: " + e.getMessage()));
        }
    }

    @GetMapping("/teacher")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> getTeacherSubmissions(Authentication authentication) {
        try {
            User teacher = (User) authentication.getPrincipal();
            List<Submission> submissions = submissionService.findSubmissionsByTeacher(teacher);
            return ResponseEntity.ok(submissions);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error fetching submissions: " + e.getMessage()));
        }
    }

    @PostMapping("/{id}/grade")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> gradeSubmission(@PathVariable Long id,
                                           @RequestParam("marks") Integer marks,
                                           @RequestParam(value = "feedback", required = false) String feedback,
                                           @RequestParam(value = "correctedFile", required = false) MultipartFile correctedFile,
                                           Authentication authentication) {
        try {
            User teacher = (User) authentication.getPrincipal();
            Optional<Submission> submissionOpt = submissionService.findById(id);
            
            if (submissionOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Submission submission = submissionOpt.get();
            
            // Check if teacher owns the assignment
            if (!submission.getAssignment().getCreatedBy().getId().equals(teacher.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Access denied"));
            }

            // Validate marks
            if (marks == null || marks < 0 || marks > 100) {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Marks must be between 0 and 100"));
            }

            // Validate corrected file if provided
            if (correctedFile != null && !correctedFile.isEmpty()) {
                if (!correctedFile.getContentType().equals("application/pdf")) {
                    return ResponseEntity.badRequest()
                        .body(new MessageResponse("Corrected file must be a PDF"));
                }
            }

            Submission gradedSubmission = submissionService.gradeSubmissionWithFile(
                id, marks, feedback, correctedFile, teacher
            );

            return ResponseEntity.ok(gradedSubmission);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error grading submission: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> updateSubmissionStatus(@PathVariable Long id,
                                                  @RequestParam SubmissionStatus status,
                                                  Authentication authentication) {
        try {
            User teacher = (User) authentication.getPrincipal();
            Optional<Submission> submissionOpt = submissionService.findById(id);
            
            if (submissionOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Submission submission = submissionOpt.get();
            
            // Check if teacher owns the assignment
            if (!submission.getAssignment().getCreatedBy().getId().equals(teacher.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Access denied"));
            }

            submissionService.updateSubmissionStatus(id, status);
            return ResponseEntity.ok(new MessageResponse("Status updated successfully"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error updating status: " + e.getMessage()));
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<?> downloadSubmission(@PathVariable Long id, Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            Optional<Submission> submissionOpt = submissionService.findById(id);
            
            if (submissionOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Submission submission = submissionOpt.get();
            
            // Check access permissions
            boolean hasAccess = false;
            if (currentUser.getRole() == UserRole.TEACHER && 
                submission.getAssignment().getCreatedBy().getId().equals(currentUser.getId())) {
                hasAccess = true;
            } else if (currentUser.getRole() == UserRole.STUDENT && 
                       submission.getStudent().getId().equals(currentUser.getId())) {
                hasAccess = true;
            }

            if (!hasAccess) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Access denied"));
            }

            // Determine which file to serve - corrected if available, otherwise original
            String filePathToServe = submission.getFilePath();
            String filenameToServe = submission.getOriginalFilename();
            
            if (submission.getCorrectedFilePath() != null && !submission.getCorrectedFilePath().isEmpty()) {
                filePathToServe = submission.getCorrectedFilePath();
                filenameToServe = submission.getCorrectedFilename();
            }

            // Load file
            Path filePath = fileStorageService.loadFile(filePathToServe);
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                       "attachment; filename=\"" + filenameToServe + "\"")
                .body(resource);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error downloading file: " + e.getMessage()));
        }
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<?> viewSubmission(@PathVariable Long id, 
                                           @RequestParam(required = false) String token,
                                           Authentication authentication) {
        try {
            User currentUser = (User) authentication.getPrincipal();
            Optional<Submission> submissionOpt = submissionService.findById(id);
            
            if (submissionOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Submission submission = submissionOpt.get();
            
            // Check access permissions
            boolean hasAccess = false;
            if (currentUser.getRole() == UserRole.TEACHER && 
                submission.getAssignment().getCreatedBy().getId().equals(currentUser.getId())) {
                hasAccess = true;
            } else if (currentUser.getRole() == UserRole.STUDENT && 
                       submission.getStudent().getId().equals(currentUser.getId())) {
                hasAccess = true;
            }

            if (!hasAccess) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(new MessageResponse("Access denied"));
            }

            // Determine which file to serve - corrected if available, otherwise original
            String filePathToServe = submission.getFilePath();
            String filenameToServe = submission.getOriginalFilename();
            
            if (submission.getCorrectedFilePath() != null && !submission.getCorrectedFilePath().isEmpty()) {
                filePathToServe = submission.getCorrectedFilePath();
                filenameToServe = submission.getCorrectedFilename();
            }

            // Load file
            Path filePath = fileStorageService.loadFile(filePathToServe);
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filenameToServe + "\"")
                .header("X-Frame-Options", "SAMEORIGIN")
                .body(resource);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error viewing file: " + e.getMessage()));
        }
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> getSubmissionStats(Authentication authentication) {
        try {
            User teacher = (User) authentication.getPrincipal();
            SubmissionService.SubmissionStats stats = submissionService.getSubmissionStats(teacher);
            return ResponseEntity.ok(stats);

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error fetching stats: " + e.getMessage()));
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