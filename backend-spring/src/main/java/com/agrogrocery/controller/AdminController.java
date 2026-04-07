package com.agrogrocery.controller;

import com.agrogrocery.model.User;
import com.agrogrocery.repository.UserRepository;
import com.agrogrocery.security.JwtUtil;
import com.agrogrocery.service.CustomUserDetailsService;
import com.agrogrocery.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private PasswordUtil passwordUtil;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> adminLogin(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            System.out.println("=== ADMIN LOGIN DEBUG ===");
            System.out.println("Email: " + email);
            System.out.println("Password: " + (password != null ? "[PRESENT]" : "[NULL]"));

            if (email == null || password == null) {
                System.out.println("VALIDATION FAILED: Missing email or password");
                return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "message", "Missing email or password"
                ));
            }

            // Check if user exists
            User user = userRepository.findByEmail(email);
            if (user == null) {
                System.out.println("Admin not found: " + email);
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Admin not found"
                ));
            }

            // Verify password
            if (!passwordUtil.matches(password, user.getPassword())) {
                System.out.println("Password mismatch for: " + email);
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Invalid credentials"
                ));
            }

            // Generate JWT token
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            String token = jwtUtil.generateToken(userDetails.getUsername());
            System.out.println("Admin login successful for: " + email);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "token", token,
                "message", "Login successful"
            ));

        } catch (Exception e) {
            System.err.println("=== ADMIN LOGIN ERROR ===");
            System.err.println("Error during admin login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Internal server error: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyAdmin(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Invalid token format"
                ));
            }

            String token = authHeader.substring(7);
            String email = jwtUtil.extractUsername(token);
            
            if (!jwtUtil.validateToken(token, email)) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Invalid or expired token"
                ));
            }

            User user = userRepository.findByEmail(email);
            if (user == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Admin not found"
                ));
            }

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Token is valid",
                "email", email
            ));

        } catch (Exception e) {
            System.err.println("Error verifying admin token: " + e.getMessage());
            return ResponseEntity.status(401).body(Map.of(
                "success", false,
                "message", "Token verification failed"
            ));
        }
    }
}
