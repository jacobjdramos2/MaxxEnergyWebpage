package com.maxxenergywebpage.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;

import java.util.HashMap;
import java.util.Map;

@Controller
public class LoginController {

    private static final String VALID_EMAIL = "user@maxx.com";
    private static final String VALID_PASSWORD = "energy123";

    @GetMapping("/")
    public String showLoginForm() {
        return "login";
    }

    // API Login endpoint for React frontend
    @PostMapping("/api/auth/login")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> apiLogin(@RequestParam String username,
                                                        @RequestParam String password,
                                                        HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();

        try {
            // This endpoint will be handled by Spring Security's form login
            // If we reach here, authentication was successful
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            if (authentication != null && authentication.isAuthenticated() &&
                    !(authentication instanceof AnonymousAuthenticationToken)) {
                response.put("success", true);
                response.put("message", "Login successful");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("error", "Authentication failed");
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/data")
    public String showDataPage() {
        return "data";
    }

    @GetMapping("/logout")
    public String logout(SessionStatus sessionStatus, HttpSession session) {
        session.invalidate(); // Oturumu sıfırla
        return "redirect:/";  // Login sayfasına yönlendir
    }

    @GetMapping("/api/user/info")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> getUserInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Map<String, Object> userInfo = new HashMap<>();

        if (authentication != null && authentication.isAuthenticated()) {
            Object principal = authentication.getPrincipal();

            if (principal instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) principal;
                userInfo.put("username", userDetails.getUsername());
                userInfo.put("authorities", userDetails.getAuthorities());
                userInfo.put("accountNonExpired", userDetails.isAccountNonExpired());
                userInfo.put("accountNonLocked", userDetails.isAccountNonLocked());
                userInfo.put("credentialsNonExpired", userDetails.isCredentialsNonExpired());
                userInfo.put("enabled", userDetails.isEnabled());
            } else {
                userInfo.put("username", authentication.getName());
                userInfo.put("authorities", authentication.getAuthorities());
            }

            return ResponseEntity.ok(userInfo);
        }

        return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
    }
}
