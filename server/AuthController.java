package com.assignmentmanagement.controller;

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
