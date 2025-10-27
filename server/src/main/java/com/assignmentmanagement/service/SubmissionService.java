package com.assignmentmanagement.service;

import com.assignmentmanagement.model.*;
import com.assignmentmanagement.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public Submission createSubmission(Assignment assignment, User student, 
                                     String filePath, String originalFilename, Long fileSize) {
        
        // Check if student has already submitted for this assignment
        if (submissionRepository.existsByAssignmentAndStudent(assignment, student)) {
            throw new RuntimeException("Student has already submitted for this assignment");
        }

        Submission submission = new Submission(assignment, student, filePath, originalFilename, fileSize);
        return submissionRepository.save(submission);
    }

    public Optional<Submission> findById(Long id) {
        return submissionRepository.findById(id);
    }

    public Optional<Submission> findByAssignmentAndStudent(Assignment assignment, User student) {
        return submissionRepository.findByAssignmentAndStudent(assignment, student);
    }

    public List<Submission> findSubmissionsByAssignment(Assignment assignment) {
        return submissionRepository.findByAssignmentOrderBySubmittedAt(assignment);
    }

    public List<Submission> findSubmissionsByStudent(User student) {
        return submissionRepository.findByStudentOrderBySubmittedAtDesc(student);
    }

    public List<Submission> findSubmissionsByTeacher(User teacher) {
        return submissionRepository.findSubmissionsByTeacher(teacher);
    }

    public List<Submission> findSubmissionsByStatus(SubmissionStatus status) {
        return submissionRepository.findByStatus(status);
    }

    public Submission updateSubmission(Submission submission) {
        return submissionRepository.save(submission);
    }

    public Submission gradeSubmission(Long submissionId, Integer marks, String feedback, User gradedBy) {
        Optional<Submission> submissionOpt = submissionRepository.findById(submissionId);
        if (submissionOpt.isPresent()) {
            Submission submission = submissionOpt.get();
            submission.setMarksObtained(marks);
            submission.setFeedback(feedback);
            submission.setGradedBy(gradedBy);
            submission.setGradedAt(LocalDateTime.now());
            submission.setStatus(SubmissionStatus.COMPLETED);
            return submissionRepository.save(submission);
        }
        throw new RuntimeException("Submission not found with id: " + submissionId);
    }

    public Submission gradeSubmissionWithFile(Long submissionId, Integer marks, String feedback, 
                                            MultipartFile correctedFile, User gradedBy) {
        Optional<Submission> submissionOpt = submissionRepository.findById(submissionId);
        if (submissionOpt.isPresent()) {
            Submission submission = submissionOpt.get();
            submission.setMarksObtained(marks);
            submission.setFeedback(feedback);
            submission.setGradedBy(gradedBy);
            submission.setGradedAt(LocalDateTime.now());
            submission.setStatus(SubmissionStatus.COMPLETED);

            // Handle corrected file if provided
            if (correctedFile != null && !correctedFile.isEmpty()) {
                try {
                    String assignmentCode = submission.getAssignment().getAssignmentCode();
                    String teacherEmail = gradedBy.getEmail();
                    String correctedFilePath = fileStorageService.storeFile(correctedFile, assignmentCode, "corrected_by_" + teacherEmail);
                    submission.setCorrectedFilePath(correctedFilePath);
                    submission.setCorrectedFilename(correctedFile.getOriginalFilename());
                } catch (Exception e) {
                    throw new RuntimeException("Failed to store corrected file: " + e.getMessage());
                }
            }

            return submissionRepository.save(submission);
        }
        throw new RuntimeException("Submission not found with id: " + submissionId);
    }

    public void updateSubmissionStatus(Long submissionId, SubmissionStatus status) {
        Optional<Submission> submissionOpt = submissionRepository.findById(submissionId);
        if (submissionOpt.isPresent()) {
            Submission submission = submissionOpt.get();
            submission.setStatus(status);
            submissionRepository.save(submission);
        }
    }

    public long getSubmissionCount(Assignment assignment) {
        return submissionRepository.countSubmissionsByAssignment(assignment);
    }

    public long getSubmissionCountByStatus(Assignment assignment, SubmissionStatus status) {
        return submissionRepository.countSubmissionsByAssignmentAndStatus(assignment, status);
    }

    public Double getAverageMarks(Assignment assignment) {
        return submissionRepository.getAverageMarksByAssignment(assignment);
    }

    public Double getStudentAverageMarks(User student) {
        return submissionRepository.getAverageMarksByStudent(student);
    }

    public List<Submission> findLateSubmissionsByTeacher(User teacher) {
        return submissionRepository.findLateSubmissionsByTeacher(teacher);
    }

    public List<Submission> findSubmissionsByDateRange(User teacher, 
                                                      LocalDateTime startDate, 
                                                      LocalDateTime endDate) {
        return submissionRepository.findSubmissionsByTeacherAndDateRange(teacher, startDate, endDate);
    }

    public boolean hasStudentSubmitted(Assignment assignment, User student) {
        return submissionRepository.existsByAssignmentAndStudent(assignment, student);
    }

    public boolean canStudentSubmit(Assignment assignment, User student) {
        // Check if assignment is active and not expired
        if (!assignment.getIsActive() || assignment.isExpired()) {
            return false;
        }
        
        // Check if student hasn't already submitted
        return !hasStudentSubmitted(assignment, student);
    }

    public void deleteSubmission(Long id) {
        submissionRepository.deleteById(id);
    }

    /**
     * Get submission statistics for a teacher
     */
    public SubmissionStats getSubmissionStats(User teacher) {
        List<Submission> submissions = findSubmissionsByTeacher(teacher);
        
        long totalSubmissions = submissions.size();
        long pendingSubmissions = submissions.stream()
            .mapToLong(s -> s.getStatus() == SubmissionStatus.PENDING ? 1 : 0)
            .sum();
        long gradedSubmissions = submissions.stream()
            .mapToLong(s -> s.getStatus() == SubmissionStatus.COMPLETED ? 1 : 0)
            .sum();
        long lateSubmissions = submissions.stream()
            .mapToLong(s -> s.getIsLateSubmission() ? 1 : 0)
            .sum();
        
        return new SubmissionStats(totalSubmissions, pendingSubmissions, gradedSubmissions, lateSubmissions);
    }

    // Inner class for submission statistics
    public static class SubmissionStats {
        private final long totalSubmissions;
        private final long pendingSubmissions;
        private final long gradedSubmissions;
        private final long lateSubmissions;

        public SubmissionStats(long totalSubmissions, long pendingSubmissions, 
                              long gradedSubmissions, long lateSubmissions) {
            this.totalSubmissions = totalSubmissions;
            this.pendingSubmissions = pendingSubmissions;
            this.gradedSubmissions = gradedSubmissions;
            this.lateSubmissions = lateSubmissions;
        }

        // Getters
        public long getTotalSubmissions() { return totalSubmissions; }
        public long getPendingSubmissions() { return pendingSubmissions; }
        public long getGradedSubmissions() { return gradedSubmissions; }
        public long getLateSubmissions() { return lateSubmissions; }
    }
}