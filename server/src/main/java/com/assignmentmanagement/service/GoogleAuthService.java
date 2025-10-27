package com.assignmentmanagement.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Map;

@Service
public class GoogleAuthService {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;

    private GoogleIdTokenVerifier verifier;
    private RestTemplate restTemplate;

    public GoogleAuthService(@Value("${spring.security.oauth2.client.registration.google.client-id}") String clientId) {
        this.googleClientId = clientId;
        this.verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(this.googleClientId))
                .build();
        this.restTemplate = new RestTemplate();
    }

    public GoogleIdToken.Payload verifyGoogleToken(String idTokenString) throws GeneralSecurityException, IOException {
        GoogleIdToken idToken = verifier.verify(idTokenString);
        if (idToken != null) {
            return idToken.getPayload();
        } else {
            throw new IllegalArgumentException("Invalid Google ID token");
        }
    }

    public String exchangeCodeForToken(String code, String redirectUri) throws IOException {
        String tokenUrl = "https://oauth2.googleapis.com/token";
        
        // Debug logging
        System.out.println("=== TOKEN EXCHANGE DEBUG ===");
        System.out.println("Code: " + (code != null ? code.substring(0, Math.min(code.length(), 20)) + "..." : "null"));
        System.out.println("Redirect URI: " + redirectUri);
        System.out.println("Client ID: " + googleClientId);
        System.out.println("Client Secret: " + (googleClientSecret != null ? googleClientSecret.substring(0, 10) + "..." : "null"));
        
        // Create proper form-encoded request
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_id", googleClientId);
        params.add("client_secret", googleClientSecret);
        params.add("code", code);
        params.add("grant_type", "authorization_code");
        params.add("redirect_uri", redirectUri);
        
        // Set proper headers for form data
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        
        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
        
        try {
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
            @SuppressWarnings("unchecked")
            Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
            
            if (responseBody != null && responseBody.containsKey("access_token")) {
                System.out.println("Token exchange successful!");
                return (String) responseBody.get("access_token");
            } else {
                System.out.println("Token exchange failed. Response: " + responseBody);
                throw new IOException("Failed to exchange authorization code for access token. Response: " + responseBody);
            }
        } catch (Exception e) {
            System.out.println("Token exchange error: " + e.getMessage());
            throw new IOException("Error during token exchange: " + e.getMessage(), e);
        }
    }

    public GoogleIdToken.Payload getUserInfoFromToken(String accessToken) throws IOException {
        String userInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";
        
        // Set authorization header
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        
        HttpEntity<String> request = new HttpEntity<>(headers);
        
        try {
            @SuppressWarnings("rawtypes")
            ResponseEntity<Map> response = restTemplate.exchange(userInfoUrl, HttpMethod.GET, request, Map.class);
            @SuppressWarnings("unchecked")
            Map<String, Object> userInfo = (Map<String, Object>) response.getBody();
            
            if (userInfo != null && userInfo.containsKey("email")) {
                // Create a mock payload with the user info
                GoogleIdToken.Payload payload = new GoogleIdToken.Payload();
                payload.setEmail((String) userInfo.get("email"));
                payload.setSubject((String) userInfo.get("id"));
                payload.set("given_name", userInfo.get("given_name"));
                payload.set("family_name", userInfo.get("family_name"));
                payload.set("picture", userInfo.get("picture"));
                return payload;
            } else {
                System.out.println("User info retrieval failed. Response: " + userInfo);
                throw new IOException("Failed to get user info from access token. Response: " + userInfo);
            }
        } catch (Exception e) {
            System.out.println("User info retrieval error: " + e.getMessage());
            throw new IOException("Error getting user info: " + e.getMessage(), e);
        }
    }
}