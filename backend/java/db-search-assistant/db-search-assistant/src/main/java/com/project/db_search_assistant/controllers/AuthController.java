package com.project.db_search_assistant.controllers;

import com.project.db_search_assistant.models.User;
import com.project.db_search_assistant.repositories.UserRepository;
import com.project.db_search_assistant.security.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost", allowCredentials = "true")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // Endpoint logowania użytkownika
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletResponse response) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        User user = userRepository.findByUsername(username);

        if (user != null && password.equals(user.getPassword())) {
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
}
