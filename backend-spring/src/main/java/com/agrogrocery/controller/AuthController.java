package com.agrogrocery.controller;

import com.agrogrocery.model.User;
import com.agrogrocery.repository.UserRepository;
import com.agrogrocery.security.JwtUtil;
import com.agrogrocery.service.CustomUserDetailsService;
import com.agrogrocery.util.PasswordUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class AuthController {

    private static final String UPLOAD_DIR = "uploads/avatars/";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private PasswordUtil passwordUtil;

    @PostMapping(value = "/signup", consumes = "application/json")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String username = request.get("username");
            String password = request.get("password");

            System.out.println("=== SIGNUP DEBUG ===");
            System.out.println("Email: " + email);
            System.out.println("Username: " + username);
            System.out.println("Password: " + (password != null ? "[PRESENT]" : "[NULL]"));

            if (email == null || username == null || password == null) {
                System.out.println("VALIDATION FAILED: Missing fields");
                return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "errors", "Missing required fields"
                ));
            }

            System.out.println("Checking for existing user...");
            User existingUser = userRepository.findByEmail(email);
            if (existingUser != null) {
                System.out.println("User already exists: " + existingUser.getEmail());
                return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "errors", "existing User Found with same email address"
                ));
            }
            System.out.println("No existing user found.");

            System.out.println("Creating cart data...");
            Map<String, Integer> cart = new HashMap<>();
            for (int i = 0; i < 300; i++) {
                cart.put(String.valueOf(i), 0);
            }
            System.out.println("Cart created with " + cart.size() + " items.");

            System.out.println("Creating user object...");
            String encodedPassword = passwordUtil.encodePassword(password);
            User user = new User(username, email, encodedPassword, cart);
            System.out.println("User object created: " + user.getName() + ", " + user.getEmail());

            System.out.println("Saving user to database...");
            user = userRepository.save(user);
            System.out.println("User saved successfully: " + user.getEmail() + ", ID: " + user.getId());

            System.out.println("Generating JWT token...");
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            String token = jwtUtil.generateToken(userDetails.getUsername());
            System.out.println("JWT token generated successfully.");

            return ResponseEntity.ok(Map.of(
                "success", true,
                "token", token
            ));
        } catch (Exception e) {
            System.err.println("=== SIGNUP ERROR ===");
            System.err.println("Error during signup: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "errors", "Internal server error: " + e.getMessage()
            ));
        }
    }

    @PostMapping(value = "/login", consumes = "application/json")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            System.out.println("=== LOGIN DEBUG ===");
            System.out.println("Email: " + email);
            System.out.println("Password: " + (password != null ? "[PRESENT]" : "[NULL]"));

            if (email == null || password == null) {
                System.out.println("VALIDATION FAILED: Missing email or password");
                return ResponseEntity.status(400).body(Map.of(
                    "success", false,
                    "errors", "Missing email or password"
                ));
            }

            User user = userRepository.findByEmail(email);
            if (user == null) {
                System.out.println("User not found: " + email);
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "errors", "User Not Found"
                ));
            }

            if (!passwordUtil.matches(password, user.getPassword())) {
                System.out.println("Password mismatch for: " + email);
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "errors", "Wrong Password"
                ));
            }

            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            String token = jwtUtil.generateToken(userDetails.getUsername());
            System.out.println("Login successful for: " + email);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "token", token
            ));
        } catch (Exception e) {
            System.err.println("=== LOGIN ERROR ===");
            System.err.println("Error during login: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "errors", "Internal server error: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/getuser")
    public ResponseEntity<User> getUser(HttpServletRequest request) {
        String email = getCurrentUserEmail(request);
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(404).build();
        }
        user.setPassword(null); // Exclude password
        return ResponseEntity.ok(user);
    }

    @PutMapping("/updateuser")
    public ResponseEntity<Map<String, Object>> updateUser(@RequestBody Map<String, String> request, 
                                                         HttpServletRequest httpRequest) {
        String email = getCurrentUserEmail(httpRequest);
        User user = userRepository.findByEmail(email);
        
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of(
                "success", false,
                "message", "User not found"
            ));
        }

        if (request.containsKey("name")) {
            user.setName(request.get("name"));
        }
        if (request.containsKey("email")) {
            user.setEmail(request.get("email"));
        }
        if (request.containsKey("address")) {
            user.setAddress(request.get("address"));
        }

        User updatedUser = userRepository.save(user);
        updatedUser.setPassword(null);

        return ResponseEntity.ok(Map.of(
            "success", true,
            "user", updatedUser
        ));
    }

    private String getCurrentUserEmail(HttpServletRequest request) {
        String token = request.getHeader("auth-token");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return jwtUtil.extractUsername(token);
    }

    @PostMapping("/uploadavatar")
    public ResponseEntity<Map<String, Object>> uploadAvatar(@RequestParam("avatar") MultipartFile file,
                                                           HttpServletRequest request) {
        try {
            String email = getCurrentUserEmail(request);
            User user = userRepository.findByEmail(email);
            
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", "User not found"
                ));
            }

            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Please select a file to upload"
                ));
            }

            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + fileExtension;
            
            // Save file
            Path filePath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath);

            // Update user avatar
            user.setAvatar("/" + UPLOAD_DIR + newFilename);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Avatar uploaded successfully",
                "avatar", user.getAvatar()
            ));

        } catch (IOException e) {
            System.err.println("Error uploading avatar: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Failed to upload avatar: " + e.getMessage()
            ));
        } catch (Exception e) {
            System.err.println("Unexpected error: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Internal server error: " + e.getMessage()
            ));
        }
    }

    @PutMapping("/changepassword")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody Map<String, String> request,
                                                            HttpServletRequest httpRequest) {
        try {
            String email = getCurrentUserEmail(httpRequest);
            User user = userRepository.findByEmail(email);
            
            if (user == null) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", "User not found"
                ));
            }

            String currentPassword = request.get("currentPassword");
            String newPassword = request.get("newPassword");

            if (currentPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Current password and new password are required"
                ));
            }

            // Verify current password
            if (!passwordUtil.matches(currentPassword, user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Current password is incorrect"
                ));
            }

            // Update password
            String encodedNewPassword = passwordUtil.encodePassword(newPassword);
            user.setPassword(encodedNewPassword);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Password updated successfully"
            ));

        } catch (Exception e) {
            System.err.println("Error changing password: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Internal server error: " + e.getMessage()
            ));
        }
    }
}
