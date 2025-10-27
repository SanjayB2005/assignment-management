package com.assignmentmanagement.controller;

import com.assignmentmanagement.dto.GoogleCallbackRequest;
import com.assignmentmanagement.dto.GoogleLoginRequest;
import com.assignmentmanagement.dto.JwtResponse;
import com.assignmentmanagement.model.AuthProvider;
import com.assignmentmanagement.model.User;
import com.assignmentmanagement.model.UserRole;
import com.assignmentmanagement.security.JwtTokenProvider;
import com.assignmentmanagement.service.GoogleAuthService;
import com.assignmentmanagement.service.UserService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private GoogleAuthService googleAuthService;

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@Valid @RequestBody GoogleLoginRequest googleLoginRequest) {
        try {
            GoogleIdToken.Payload payload = googleAuthService.verifyGoogleToken(googleLoginRequest.getIdToken());
            
            String email = payload.getEmail();
            String firstName = (String) payload.get("given_name");
            String lastName = (String) payload.get("family_name");
            String googleId = payload.getSubject();
            String profilePictureUrl = (String) payload.get("picture");

            User user = userService.findByEmail(email).orElse(null);
            
            if (user == null) {
                UserRole role = null;
                if (googleLoginRequest.getRole() != null) {
                    try {
                        role = UserRole.valueOf(googleLoginRequest.getRole().toUpperCase());
                    } catch (IllegalArgumentException e) {
                        role = null;
                    }
                }
                
                user = new User(email, firstName, lastName, role, AuthProvider.GOOGLE, googleId, profilePictureUrl);
                user = userService.createOAuthUser(user);
            }

            String jwt = tokenProvider.generateTokenFromUsername(user.getEmail());
            
            return ResponseEntity.ok(new JwtResponse(jwt, user.getId(), user.getEmail(), 
                                                   user.getFirstName(), user.getLastName(), user.getRole()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: Invalid Google token or authentication failed!"));
        }
    }

    @PostMapping("/google/callback")
    public ResponseEntity<?> googleCallback(@RequestBody GoogleCallbackRequest callbackRequest) {
        try {
            // Debug logging to understand what we're receiving
            System.out.println("=== GOOGLE OAUTH CALLBACK DEBUG ===");
            System.out.println("Code: " + (callbackRequest.getCode() != null ? callbackRequest.getCode().substring(0, Math.min(callbackRequest.getCode().length(), 20)) + "..." : "null"));
            System.out.println("Redirect URI: " + callbackRequest.getRedirectUri());
            System.out.println("Role: " + callbackRequest.getRole());
            
            // Manual validation with better error messages
            if (callbackRequest.getCode() == null || callbackRequest.getCode().trim().isEmpty()) {
                System.out.println("ERROR: Authorization code is missing or empty");
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Authorization code is missing"));
            }
            
            if (callbackRequest.getRedirectUri() == null || callbackRequest.getRedirectUri().trim().isEmpty()) {
                System.out.println("ERROR: Redirect URI is missing or empty");
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("Error: Redirect URI is missing"));
            }
            
            // Exchange authorization code for access token
            String accessToken = googleAuthService.exchangeCodeForToken(
                callbackRequest.getCode(), 
                callbackRequest.getRedirectUri()
            );
            
            // Get user info using the access token
            GoogleIdToken.Payload payload = googleAuthService.getUserInfoFromToken(accessToken);
            
            String email = payload.getEmail();
            String firstName = (String) payload.get("given_name");
            String lastName = (String) payload.get("family_name");
            String googleId = payload.getSubject();
            String profilePictureUrl = (String) payload.get("picture");
            
            // Debug logging to see what Google provides
            System.out.println("Google user info:");
            System.out.println("- Email: " + email);
            System.out.println("- First Name: " + firstName);
            System.out.println("- Last Name: " + lastName);
            System.out.println("- Google ID: " + googleId);
            
            // Handle missing or empty names with fallbacks
            if (firstName == null || firstName.trim().isEmpty()) {
                firstName = "Google User";
                System.out.println("WARNING: No first name provided, using fallback: " + firstName);
            } else {
                firstName = firstName.trim();
            }
            
            if (lastName == null || lastName.trim().isEmpty()) {
                lastName = "User";
                System.out.println("WARNING: No last name provided, using fallback: " + lastName);
            } else {
                lastName = lastName.trim();
            }

            User user = userService.findByEmail(email).orElse(null);
            
            if (user == null) {
                UserRole role = null;
                if (callbackRequest.getRole() != null && !callbackRequest.getRole().trim().isEmpty()) {
                    try {
                        role = UserRole.valueOf(callbackRequest.getRole().toUpperCase());
                    } catch (IllegalArgumentException e) {
                        System.out.println("WARNING: Invalid role provided: " + callbackRequest.getRole() + ", defaulting to STUDENT");
                        role = UserRole.STUDENT; // Default to STUDENT if invalid role
                    }
                } else {
                    role = UserRole.STUDENT; // Default role
                }
                
                System.out.println("Creating new user with:");
                System.out.println("- Email: " + email);
                System.out.println("- First Name: '" + firstName + "'");
                System.out.println("- Last Name: '" + lastName + "'");
                System.out.println("- Role: " + role);
                System.out.println("- Google ID: " + googleId);
                
                user = new User(email, firstName, lastName, role, AuthProvider.GOOGLE, googleId, profilePictureUrl);
                
                try {
                    user = userService.createOAuthUser(user);
                    System.out.println("User created successfully with ID: " + user.getId());
                } catch (Exception e) {
                    System.out.println("ERROR creating user: " + e.getMessage());
                    e.printStackTrace();
                    return ResponseEntity.badRequest()
                        .body(new MessageResponse("Error: Failed to create user account - " + e.getMessage()));
                }
            } else {
                System.out.println("Existing user found with email: " + email + ", ID: " + user.getId());
            }

            String jwt = tokenProvider.generateTokenFromUsername(user.getEmail());
            
            return ResponseEntity.ok(new JwtResponse(jwt, user.getId(), user.getEmail(), 
                                                   user.getFirstName(), user.getLastName(), user.getRole()));
        } catch (Exception e) {
            System.err.println("Google OAuth callback error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: OAuth callback failed - " + e.getMessage()));
        }
    }

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
