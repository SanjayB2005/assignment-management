package com.assignmentmanagement.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class UpdateRoleRequest {
    @NotBlank
    @Pattern(regexp = "STUDENT|TEACHER", message = "Role must be either STUDENT or TEACHER")
    private String role;

    public UpdateRoleRequest() {}

    public UpdateRoleRequest(String role) {
        this.role = role;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}