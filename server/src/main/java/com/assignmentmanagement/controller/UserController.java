package com.assignmentmanagement.controller;

import com.assignmentmanagement.dto.JwtResponse;
import com.assignmentmanagement.dto.UpdateRoleRequest;
import com.assignmentmanagement.model.AuthProvider;
import com.assignmentmanagement.model.User;
import com.assignmentmanagement.model.UserRole;
import com.assignmentmanagement.security.JwtTokenProvider;
import com.assignmentmanagement.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PutMapping("/update-role")
    public ResponseEntity<?> updateUserRole(@Valid @RequestBody UpdateRoleRequest updateRoleRequest,
                                          @RequestHeader("Authorization") String authHeader) {
        try {
            // Extract JWT token from Authorization header
            String token = null;
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
            
            if (token == null || !tokenProvider.validateToken(token)) {
                return ResponseEntity.badRequest().body(new MessageResponse("Invalid or missing token"));
            }

            String email = tokenProvider.getUsernameFromToken(token);
            User user = userService.findByEmail(email).orElse(null);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(new MessageResponse("User not found"));
            }

            // Only allow role updates for Google OAuth users
            if (user.getAuthProvider() != AuthProvider.GOOGLE) {
                return ResponseEntity.badRequest().body(new MessageResponse("Role update only allowed for Google OAuth users"));
            }

            // Update the user's role
            try {
                UserRole newRole = UserRole.valueOf(updateRoleRequest.getRole().toUpperCase());
                user.setRole(newRole);
                user = userService.updateUser(user);

                // Generate a new token with the updated role
                String newToken = tokenProvider.generateTokenFromUsername(user.getEmail());

                return ResponseEntity.ok(new JwtResponse(newToken, user.getId(), user.getEmail(),
                        user.getFirstName(), user.getLastName(), user.getRole()));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(new MessageResponse("Invalid role: " + updateRoleRequest.getRole()));
            }
        } catch (Exception e) {
            System.out.println("=== UPDATE ROLE ERROR ===");
            System.out.println("Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse("Error updating user role"));
        }
    }

    // Inner class for response message
    static class MessageResponse {
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