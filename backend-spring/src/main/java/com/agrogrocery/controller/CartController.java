package com.agrogrocery.controller;

import com.agrogrocery.model.User;
import com.agrogrocery.repository.UserRepository;
import com.agrogrocery.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class CartController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/addtocart")
    public ResponseEntity<Map<String, Object>> addToCart(@RequestBody Map<String, String> request, 
                                          HttpServletRequest httpRequest) {
        String itemId = request.get("itemId");
        String email = getCurrentUserEmail(httpRequest);
        
        if (email == null) {
            System.out.println("No valid user found for addtocart");
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "User not authenticated"));
        }
        
        User user = userRepository.findByEmail(email);
        if (user.getCartData() == null || !user.getCartData().containsKey(itemId)) {
            user.getCartData().put(itemId, 0);
        }
        
        int currentQuantity = user.getCartData().get(itemId);
        user.getCartData().put(itemId, currentQuantity + 1);
        
        userRepository.save(user);
        System.out.println("Added " + itemId);
        
        return ResponseEntity.ok(Map.of("success", true, "message", "Added"));
    }

    @PostMapping("/removefromcart")
    public ResponseEntity<Map<String, Object>> removeFromCart(@RequestBody Map<String, String> request, 
                                                HttpServletRequest httpRequest) {
        String itemId = request.get("itemId");
        String email = getCurrentUserEmail(httpRequest);
        
        if (email == null) {
            System.out.println("No valid user found for removefromcart");
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "User not authenticated"));
        }
        
        User user = userRepository.findByEmail(email);
        if (user == null) {
            System.out.println("No valid user found for removefromcart");
            return ResponseEntity.status(401).body(Map.of("success", false, "message", "User not authenticated"));
        }
        
        if (user.getCartData() != null && user.getCartData().containsKey(itemId)) {
            int currentQuantity = user.getCartData().get(itemId);
            if (currentQuantity > 0) {
                user.getCartData().put(itemId, currentQuantity - 1);
                userRepository.save(user);
            }
        }
        
        System.out.println("Removed " + itemId);
        return ResponseEntity.ok(Map.of("success", true, "message", "Removed"));
    }

    @PostMapping("/getcart")
    public ResponseEntity<Map<String, Integer>> getCart(HttpServletRequest httpRequest) {
        String email = getCurrentUserEmail(httpRequest);
        if (email == null) {
            System.out.println("No valid user found, returning empty cart");
            return ResponseEntity.ok(Map.of());
        }
        User user = userRepository.findByEmail(email);
        System.out.println("GetCart for user: " + email);
        return ResponseEntity.ok(user.getCartData());
    }

    private String getCurrentUserEmail(HttpServletRequest request) {
        String token = request.getHeader("auth-token");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        try {
            return jwtUtil.extractUsername(token);
        } catch (Exception e) {
            System.out.println("JWT extraction failed: " + e.getMessage());
            return null;
        }
    }
}
