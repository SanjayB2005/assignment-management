package com.assignmentmanagement.dto;

import jakarta.validation.constraints.NotBlank;

public class GoogleCallbackRequest {
    
    @NotBlank
    private String code;
    
    @NotBlank
    private String redirectUri;
    
    private String role; // Optional, defaults to STUDENT
    
    public GoogleCallbackRequest() {}
    
    public GoogleCallbackRequest(String code, String redirectUri, String role) {
        this.code = code;
        this.redirectUri = redirectUri;
        this.role = role;
    }
    
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    
    public String getRedirectUri() {
        return redirectUri;
    }
    
    public void setRedirectUri(String redirectUri) {
        this.redirectUri = redirectUri;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
}