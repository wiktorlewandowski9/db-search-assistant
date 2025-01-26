package com.project.db_search_assistant.controllers;

import com.project.db_search_assistant.models.User;
import com.project.db_search_assistant.repositories.UserRepository;
import com.project.db_search_assistant.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import java.security.SecureRandom;
import java.util.Base64;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostConstruct
    public void ensureAdminUserExists() {
        String adminUsername = "admin";
        if (userRepository.findByUsername(adminUsername) == null) {
            String randomPassword = generateRandomPassword();
            User adminUser = new User();
            adminUser.setUsername(adminUsername);
            adminUser.setPassword(passwordEncoder.encode(randomPassword));
            userRepository.save(adminUser);
            System.out.println("Admin user created with password: " + randomPassword);
        }
    }

    private String generateRandomPassword() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[24];
        random.nextBytes(bytes);
        return Base64.getEncoder().encodeToString(bytes);
    }

    // Endpoint logowania użytkownika
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletResponse response) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        User user = userRepository.findByUsername(username);

        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            String token = jwtUtil.generateToken(username);

            ResponseCookie cookie = ResponseCookie.from("jwt", token)
                    .httpOnly(true)
                    .path("/")
                    .secure(false)
                    .sameSite("Strict")
                    .maxAge(3600)
                    .build();

            response.addHeader("Set-Cookie", cookie.toString());

            return ResponseEntity.ok(Map.of("message", "Login successful"));
        }
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }

    // Endpoint weryfikacji tokena JWT
    @GetMapping("/protected")
    public ResponseEntity<?> protectedRoute(@CookieValue(value = "jwt", required = false) String token) {
        if (token != null) {
            try {
                String username = jwtUtil.validateToken(token);
                return ResponseEntity.ok(Map.of("message", "Access granted to " + username));
            } catch (Exception e) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
            }
        }
        return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
    }

    // Endpoint wylogowania
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .path("/")
                .secure(false)
                .sameSite("Strict")
                .maxAge(0)
                .build();

        response.addHeader("Set-Cookie", cookie.toString());
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }

    // Endpoint to fetch all users
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers(@CookieValue(value = "jwt", required = false) String token) {
        if (token != null) {
            try {
                String username = jwtUtil.validateToken(token);
                if (!"admin".equals(username)) {
                    return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
                }
                return ResponseEntity.ok(userRepository.findAll());
            } catch (Exception e) {
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden"));
            }
        }
        return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (user.getUsername() == null || user.getUsername().isEmpty() || user.getPassword() == null
                || user.getPassword().isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("error", "Username and password cannot be empty"));
        }
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return ResponseEntity.status(400).body(Map.of("error", "User already exists"));
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    // Endpoint to delete a user by ID
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        }
        return ResponseEntity.status(404).body(Map.of("error", "User not found"));
    }

    // Endpoint to change the username of a user
    @PutMapping("/users/{id}/change-username")
    public ResponseEntity<?> changeUsername(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newUsername = request.get("newUsername");
        if (userRepository.existsById(id)) {
            User user = userRepository.findById(id).orElse(null);
            if (user != null && userRepository.findByUsername(newUsername) == null) {
                user.setUsername(newUsername);
                userRepository.save(user);
                return ResponseEntity.ok(Map.of("message", "Username changed successfully"));
            }
            return ResponseEntity.status(400).body(Map.of("error", "Username already taken"));
        }
        return ResponseEntity.status(404).body(Map.of("error", "User not found"));
    }

    // Endpoint to change the password of a user
    @PutMapping("/users/{id}/change-password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String newPassword = request.get("newPassword");
        if (userRepository.existsById(id)) {
            User user = userRepository.findById(id).orElse(null);
            if (user != null) {
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
            }
        }
        return ResponseEntity.status(404).body(Map.of("error", "User not found"));
    }
}
