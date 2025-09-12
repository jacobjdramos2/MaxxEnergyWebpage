package com.maxxenergywebpage.controller;

import com.maxxenergywebpage.model.User;
import com.maxxenergywebpage.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.support.SessionStatus;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class LoginController {

    // Inject UserRepository for database interaction
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Store for password reset tokens: username -> token
    private final Map<String, String> passwordResetTokens = new ConcurrentHashMap<>();
    // Store for token expiration times: token -> expiration time
    private final Map<String, Long> tokenExpirationTimes = new ConcurrentHashMap<>();
    // Token validity period in milliseconds (30 minutes)
    private static final long TOKEN_VALIDITY_PERIOD = 30 * 60 * 1000;

    @Autowired
    public LoginController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Show login form
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
            // Retrieve user from the database
            Optional<User> userOptional = userRepository.findByUsername(username);

            if (userOptional.isEmpty()) {
                response.put("success", false);
                response.put("error", "Invalid username or password");
                return ResponseEntity.status(401).body(response);
            }

            User user = userOptional.get();

            if (!user.isActive()) {
                response.put("success", false);
                response.put("error", "Account is inactive");
                return ResponseEntity.status(403).body(response);
            }

            // Validate password using PasswordEncoder
            if (!passwordEncoder.matches(password, user.getPassword())) {
                response.put("success", false);
                response.put("error", "Invalid username or password");
                return ResponseEntity.status(401).body(response);
            }

            // If authentication is successful
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated() &&
                    !(authentication instanceof AnonymousAuthenticationToken)) {
                response.put("success", true);
                response.put("message", "Login successful");
                return ResponseEntity.ok(response);
            }

            response.put("success", false);
            response.put("error", "Authentication failed");

        } catch (Exception e) {
            response.put("success", false);
            response.put("error", "An error occurred during login: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }

        return ResponseEntity.status(401).body(response);
    }

    // Show the data page
    @GetMapping("/data")
    public String showDataPage() {
        return "data";
    }

    // Logout endpoint
    @GetMapping("/logout")
    public String logout(SessionStatus sessionStatus, HttpSession session) {
        session.invalidate();
        return "redirect:/";
    }

    // Return user info endpoint
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

    // Forgot Password endpoint
    @PostMapping("/api/auth/forgot-password")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> forgotPassword(@RequestParam String username) {
        Map<String, Object> response = new HashMap<>();

        // Retrieve the user from the database
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            // Generate a unique reset token
            String token = UUID.randomUUID().toString();

            // Associate token with the user and set expiration time
            passwordResetTokens.put(username, token);
            tokenExpirationTimes.put(token, System.currentTimeMillis() + TOKEN_VALIDITY_PERIOD);

            response.put("success", true);
            response.put("message", "Password reset instructions have been sent to your email.");
            response.put("token", token); // In production, do not expose the token here!

            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("error", "Username not found");
            return ResponseEntity.status(404).body(response);
        }
    }

    // Validate Reset Token endpoint
    @GetMapping("/api/auth/validate-reset-token")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> validateResetToken(@RequestParam String token) {
        Map<String, Object> response = new HashMap<>();

        Long expirationTime = tokenExpirationTimes.get(token);
        if (expirationTime != null && expirationTime > System.currentTimeMillis()) {
            response.put("success", true);
            response.put("message", "Token is valid");
            return ResponseEntity.ok(response);
        } else {
            if (expirationTime != null) {
                tokenExpirationTimes.remove(token);
                passwordResetTokens.entrySet().removeIf(entry -> entry.getValue().equals(token));
            }
            response.put("success", false);
            response.put("error", "Invalid or expired token");
            return ResponseEntity.status(400).body(response);
        }
    }

    // Reset Password endpoint
    @PostMapping("/api/auth/reset-password")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> resetPassword(@RequestParam String token,
                                                             @RequestParam String newPassword) {
        Map<String, Object> response = new HashMap<>();

        Long expirationTime = tokenExpirationTimes.get(token);
        if (expirationTime != null && expirationTime > System.currentTimeMillis()) {
            String username = null;
            for (Map.Entry<String, String> entry : passwordResetTokens.entrySet()) {
                if (entry.getValue().equals(token)) {
                    username = entry.getKey();
                    break;
                }
            }

            if (username != null) {
                // Update user's password in the database
                Optional<User> userOptional = userRepository.findByUsername(username);
                if (userOptional.isPresent()) {
                    User user = userOptional.get();
                    user.setPassword(passwordEncoder.encode(newPassword));
                    userRepository.save(user); // Save updated password in the database

                    passwordResetTokens.remove(username);
                    tokenExpirationTimes.remove(token);

                    response.put("success", true);
                    response.put("message", "Password has been reset successfully");
                    return ResponseEntity.ok(response);
                }
            }
        }

        response.put("success", false);
        response.put("error", "Invalid or expired token");
        return ResponseEntity.status(400).body(response);
    }
}