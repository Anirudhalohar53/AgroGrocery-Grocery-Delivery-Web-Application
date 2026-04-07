package com.agrogrocery.controller;

import com.agrogrocery.model.Order;
import com.agrogrocery.model.User;
import com.agrogrocery.repository.OrderRepository;
import com.agrogrocery.repository.UserRepository;
import com.agrogrocery.security.JwtUtil;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import jakarta.servlet.http.HttpServletRequest;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/razorpay")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class RazorpayController {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> request,
                                                           HttpServletRequest httpRequest) {
        try {
            // Debug logging
            System.out.println("=== Razorpay Order Creation Debug ===");
            System.out.println("Request headers:");
            httpRequest.getHeaderNames().asIterator().forEachRemaining(header -> 
                System.out.println(header + ": " + httpRequest.getHeader(header)));
            
            String token = httpRequest.getHeader("auth-token");
            System.out.println("Auth token: " + (token != null ? token.substring(0, Math.min(token.length(), 20)) + "..." : "null"));
            
            String email = getCurrentUserEmail(httpRequest);
            System.out.println("Extracted email: " + email);
            
            User user = userRepository.findByEmail(email);
            System.out.println("User found: " + (user != null ? "YES" : "NO"));
            
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "User not found. Email: " + email
                ));
            }

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> items = (List<Map<String, Object>>) request.get("items");
            
            // Handle amount that could be Integer, Double, or String
            Object amountObj = request.get("amount");
            System.out.println("Raw amount object: " + amountObj + " (class: " + (amountObj != null ? amountObj.getClass().getName() : "null") + ")");
            
            Double amount;
            if (amountObj == null) {
                amount = 0.0;
                System.out.println("Amount was null, using 0.0");
            } else if (amountObj instanceof Integer) {
                amount = ((Integer) amountObj).doubleValue();
                System.out.println("Converted Integer to Double: " + amount);
            } else if (amountObj instanceof Double) {
                amount = (Double) amountObj;
                System.out.println("Already Double: " + amount);
            } else if (amountObj instanceof String) {
                try {
                    amount = Double.parseDouble((String) amountObj);
                    System.out.println("Converted String to Double: " + amount);
                } catch (NumberFormatException e) {
                    amount = 0.0;
                    System.out.println("Failed to parse String amount, using 0.0");
                }
            } else {
                amount = 0.0;
                System.out.println("Unexpected type for amount: " + amountObj.getClass().getName() + ", using 0.0");
            }
            
            @SuppressWarnings("unchecked")
            Map<String, Object> address = (Map<String, Object>) request.get("address");
            
            System.out.println("Order data - Items: " + (items != null ? items.size() : 0) + ", Amount: " + amount + " (type: " + (amountObj != null ? amountObj.getClass().getSimpleName() : "null") + ")");

            // Generate a temporary order ID for Razorpay receipt (not saving to database yet)
            String tempOrderId = "TEMP_" + System.currentTimeMillis() + "_" + user.getId().substring(0, 8);
            System.out.println("Generated temporary order ID: " + tempOrderId);

            // Create Razorpay order
            System.out.println("Creating Razorpay order...");
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            JSONObject orderRequest = new JSONObject();
            // Convert amount to paise (Razorpay expects amount in smallest currency unit)
            long amountInPaise = (long) ((amount + 2) * 100); // Adding 2 rupees delivery charge
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", tempOrderId);
            orderRequest.put("payment_capture", 1);

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            System.out.println("Razorpay order created: " + razorpayOrder.get("id"));

            // Store order data in session/temporary storage for payment verification
            // We'll create the actual order only after successful payment
            Map<String, Object> tempOrderData = Map.of(
                "userId", user.getId(),
                "items", items,
                "amount", amount,
                "address", address,
                "tempOrderId", tempOrderId,
                "razorpayOrderId", razorpayOrder.get("id")
            );
            
            // For now, we'll pass the order data in the response and store it during verification
            // In production, you might want to use Redis or a temporary database table

            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("order", Map.of(
                "id", razorpayOrder.get("id"),
                "amount", razorpayOrder.get("amount"),
                "currency", razorpayOrder.get("currency"),
                "receipt", razorpayOrder.get("receipt")
            ));
            response.put("tempOrderId", tempOrderId);
            response.put("orderData", tempOrderData); // Include order data for verification
            response.put("keyId", razorpayKeyId);

            return ResponseEntity.ok(response);

        } catch (RazorpayException e) {
            System.err.println("Razorpay Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "Failed to create payment order: " + e.getMessage()
            ));
        } catch (Exception e) {
            System.err.println("General Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "Error creating order: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, Object> request,
                                                           HttpServletRequest httpRequest) {
        try {
            String razorpayOrderId = (String) request.get("razorpay_order_id");
            String razorpayPaymentId = (String) request.get("razorpay_payment_id");
            String razorpaySignature = (String) request.get("razorpay_signature");
            String orderId = (String) request.get("orderId");
            
            // Get order data from request (passed from frontend)
            @SuppressWarnings("unchecked")
            Map<String, Object> orderData = (Map<String, Object>) request.get("orderData");

            // Verify signature
            System.out.println("=== PAYMENT VERIFICATION DEBUG ===");
            System.out.println("Razorpay Order ID: " + razorpayOrderId);
            System.out.println("Razorpay Payment ID: " + razorpayPaymentId);
            System.out.println("Razorpay Signature: " + razorpaySignature);
            
            String generatedSignature = generateSignature(razorpayOrderId, razorpayPaymentId);
            System.out.println("Generated Signature: " + generatedSignature);
            System.out.println("Signatures Match: " + generatedSignature.equals(razorpaySignature));
            
            if (!generatedSignature.equals(razorpaySignature)) {
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Payment verification failed: Invalid signature"
                ));
            }

            // Payment is successful, now create the actual order in database
            if (orderData != null) {
                String userId = (String) orderData.get("userId");
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> items = (List<Map<String, Object>>) orderData.get("items");
                // Handle amount that could be Integer, Double, or String
                Object amountObj = orderData.get("amount");
                Double amount;
                if (amountObj == null) {
                    amount = 0.0;
                } else if (amountObj instanceof Integer) {
                    amount = ((Integer) amountObj).doubleValue();
                } else if (amountObj instanceof Double) {
                    amount = (Double) amountObj;
                } else if (amountObj instanceof String) {
                    try {
                        amount = Double.parseDouble((String) amountObj);
                    } catch (NumberFormatException e) {
                        amount = 0.0;
                    }
                } else {
                    amount = 0.0;
                }
                @SuppressWarnings("unchecked")
                Map<String, Object> address = (Map<String, Object>) orderData.get("address");
                
                // Create the actual order now that payment is successful
                Order newOrder = new Order(userId, items, amount, address);
                newOrder.setPaymentMethod("RAZORPAY");
                newOrder.setPayment(true); // Payment completed
                newOrder = orderRepository.save(newOrder);
                
                // Clear user's cart only after successful payment
                User user = userRepository.findById(userId).orElse(null);
                if (user != null) {
                    Map<String, Integer> emptyCart = new HashMap<>();
                    for (int i = 0; i < 300; i++) {
                        emptyCart.put(String.valueOf(i), 0);
                    }
                    user.setCartData(emptyCart);
                    userRepository.save(user);
                }
                
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Payment successful",
                    "orderId", newOrder.getId()
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Order data not found"
                ));
            }

        } catch (Exception e) {
            System.out.println("Error: " + e);
            return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "Payment verification failed"
            ));
        }
    }

    private String generateSignature(String orderId, String paymentId) {
        try {
            String data = orderId + "|" + paymentId;
            System.out.println("Signature Data: " + data);
            System.out.println("Using Key Secret: " + razorpayKeySecret.substring(0, Math.min(razorpayKeySecret.length(), 10)) + "...");
            
            // Generate HMAC SHA256 signature
            String expectedSignature = hmacsha256(data, razorpayKeySecret);
            
            return expectedSignature;
        } catch (Exception e) {
            throw new RuntimeException("Signature generation failed", e);
        }
    }
    
    private String hmacsha256(String data, String key) throws Exception {
        javax.crypto.Mac sha256_HMAC = javax.crypto.Mac.getInstance("HmacSHA256");
        javax.crypto.spec.SecretKeySpec secret_key = new javax.crypto.spec.SecretKeySpec(key.getBytes(), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        byte[] digest = sha256_HMAC.doFinal(data.getBytes());
        
        StringBuilder hexString = new StringBuilder();
        for (byte b : digest) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        
        return hexString.toString();
    }

    private String getCurrentUserEmail(HttpServletRequest request) {
        String token = request.getHeader("auth-token");
        System.out.println("Raw auth token: " + token);
        
        if (token == null || token.trim().isEmpty()) {
            System.out.println("No auth token provided");
            return null;
        }
        
        // Remove "Bearer " prefix if present
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        try {
            String email = jwtUtil.extractUsername(token);
            System.out.println("Successfully extracted email: " + email);
            return email;
        } catch (Exception e) {
            System.err.println("Error extracting email from token: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
}
