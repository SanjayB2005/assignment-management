package com.assignmentmanagement.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class AssignmentCodeGenerator {
    
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 5;
    private static final SecureRandom random = new SecureRandom();
    
    /**
     * Generates a random 5-digit alphanumeric code
     * @return String containing 5 random alphanumeric characters
     */
    public String generateCode() {
        StringBuilder code = new StringBuilder(CODE_LENGTH);
        
        for (int i = 0; i < CODE_LENGTH; i++) {
            int index = random.nextInt(CHARACTERS.length());
            code.append(CHARACTERS.charAt(index));
        }
        
        return code.toString();
    }
    
    /**
     * Validates if a code follows the correct format
     * @param code the code to validate
     * @return true if valid, false otherwise
     */
    public boolean isValidCode(String code) {
        if (code == null || code.length() != CODE_LENGTH) {
            return false;
        }
        
        return code.matches("[A-Z0-9]{5}");
    }
}