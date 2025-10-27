package com.assignmentmanagement.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleLoginRequest {
    
    @NotBlank
    private String idToken;
    
    private String role; // Optional, for registration

    public GoogleLoginRequest() {}

    public GoogleLoginRequest(String idToken, String role) {
        this.idToken = idToken;
        this.role = role;
    }

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}