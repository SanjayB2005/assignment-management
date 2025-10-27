package com.assignmentmanagement.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final String[] ALLOWED_EXTENSIONS = {"pdf"};

    public String storeFile(MultipartFile file, String assignmentCode, String studentEmail) {
        // Validate file
        validateFile(file);

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            // Generate unique filename
            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = getFileExtension(originalFilename);
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String uniqueId = UUID.randomUUID().toString().substring(0, 8);
            String newFilename = String.format("%s_%s_%s_%s.%s", 
                assignmentCode, 
                studentEmail.replace("@", "_").replace(".", "_"),
                timestamp,
                uniqueId,
                fileExtension
            );

            // Copy file to upload directory
            Path targetLocation = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return targetLocation.toString();

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file. Please try again!", ex);
        }
    }

    public Path loadFile(String filename) {
        Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(filename);
        
        if (!Files.exists(filePath)) {
            throw new RuntimeException("File not found: " + filename);
        }
        
        return filePath;
    }

    public void deleteFile(String filePath) {
        try {
            Path path = Paths.get(filePath);
            Files.deleteIfExists(path);
        } catch (IOException ex) {
            throw new RuntimeException("Could not delete file: " + filePath, ex);
        }
    }

    public boolean fileExists(String filePath) {
        Path path = Paths.get(filePath);
        return Files.exists(path);
    }

    public long getFileSize(String filePath) {
        try {
            Path path = Paths.get(filePath);
            return Files.size(path);
        } catch (IOException ex) {
            return 0;
        }
    }

    private void validateFile(MultipartFile file) {
        // Check if file is empty
        if (file.isEmpty()) {
            throw new RuntimeException("Cannot upload empty file");
        }

        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new RuntimeException("File size exceeds maximum limit of 10MB");
        }

        // Check file extension
        String filename = StringUtils.cleanPath(file.getOriginalFilename());
        String extension = getFileExtension(filename);
        
        boolean isValidExtension = false;
        for (String allowedExt : ALLOWED_EXTENSIONS) {
            if (allowedExt.equalsIgnoreCase(extension)) {
                isValidExtension = true;
                break;
            }
        }

        if (!isValidExtension) {
            throw new RuntimeException("Only PDF files are allowed");
        }

        // Check for invalid characters in filename
        if (filename.contains("..")) {
            throw new RuntimeException("Filename contains invalid path sequence");
        }
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }
        
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        
        return filename.substring(lastDotIndex + 1);
    }

    public String getUploadDir() {
        return uploadDir;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }
}