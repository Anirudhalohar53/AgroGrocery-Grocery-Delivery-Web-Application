package com.agrogrocery.controller;

import com.agrogrocery.model.Order;
import com.agrogrocery.model.User;
import com.agrogrocery.repository.OrderRepository;
import com.agrogrocery.repository.UserRepository;
import com.agrogrocery.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/place")
    public ResponseEntity<Map<String, Object>> placeOrder(@RequestBody Map<String, Object> request, 
                                                        HttpServletRequest httpRequest) {
        try {
            String email = getCurrentUserEmail(httpRequest);
            User user = userRepository.findByEmail(email);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "User not found"
                ));
            }

            // Redirect to Razorpay payment endpoint
            // This endpoint is deprecated - use /api/razorpay/create-order instead
            return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "This endpoint is deprecated. Please use /api/razorpay/create-order for payments"
            ));

        } catch (Exception e) {
            System.out.println("Error: " + e);
            return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "Error"
            ));
        }
    }

    @PostMapping("/place-cod")
    public ResponseEntity<Map<String, Object>> placeCODOrder(@RequestBody Map<String, Object> request, 
                                                           HttpServletRequest httpRequest) {
        try {
            String email = getCurrentUserEmail(httpRequest);
            User user = userRepository.findByEmail(email);
            
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "User not found"
                ));
            }

            // Create COD order
            Order order = new Order();
            order.setUserId(user.getId());
            order.setItems((List<Map<String, Object>>) request.get("items"));
            
            // Handle amount as either Integer or Double
            Object amountObj = request.get("amount");
            double amount;
            if (amountObj instanceof Integer) {
                amount = ((Integer) amountObj).doubleValue();
            } else if (amountObj instanceof Double) {
                amount = (Double) amountObj;
            } else {
                amount = Double.parseDouble(amountObj.toString());
            }
            order.setAmount(amount);
            
            order.setAddress((Map<String, Object>) request.get("address"));
            order.setPaymentMethod("COD");
            order.setPayment(false); // Payment pending (to be paid on delivery)
            
            Order savedOrder = orderRepository.save(order);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "orderId", savedOrder.getId(),
                "message", "COD order placed successfully"
            ));

        } catch (Exception e) {
            System.out.println("Error placing COD order: " + e);
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Error placing COD order: " + e.getMessage()
            ));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, Object> request,
                                                           HttpServletRequest httpRequest) {
        String orderId = (String) request.get("orderId");
        String success = (String) request.get("success");

        try {
            if ("true".equals(success)) {
                Order order = orderRepository.findById(orderId).orElse(null);
                if (order != null) {
                    order.setPayment(true);
                    orderRepository.save(order);
                }
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Paid"
                ));
            } else {
                orderRepository.deleteById(orderId);
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Payment Failed"
                ));
            }
        } catch (Exception e) {
            System.out.println("Error: " + e);
            return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "Error"
            ));
        }
    }

    @PostMapping("/userorders")
    public ResponseEntity<Map<String, Object>> getUserOrders(HttpServletRequest httpRequest) {
        try {
            String email = getCurrentUserEmail(httpRequest);
            User user = userRepository.findByEmail(email);
            
            if (user == null) {
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "User not found"
                ));
            }

            List<Order> orders = orderRepository.findByUserId(user.getId());
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", orders
            ));
        } catch (Exception e) {
            System.out.println("Error: " + e);
            return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "Error"
            ));
        }
    }

    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> getAllOrders() {
        try {
            List<Order> orders = orderRepository.findAll();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "data", orders
            ));
        } catch (Exception e) {
            System.out.println("Error: " + e);
            return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "Error"
            ));
        }
    }

    @PostMapping("/status")
    public ResponseEntity<Map<String, Object>> updateOrderStatus(@RequestBody Map<String, Object> request) {
        try {
            String orderId = (String) request.get("orderId");
            String status = (String) request.get("status");

            Order order = orderRepository.findById(orderId).orElse(null);
            if (order != null) {
                order.setStatus(status);
                orderRepository.save(order);
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Status updated"
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Order not found"
                ));
            }
        } catch (Exception e) {
            System.out.println("Error: " + e);
            return ResponseEntity.ok(Map.of(
                "success", false,
                "message", "Error"
            ));
        }
    }

    private String getCurrentUserEmail(HttpServletRequest request) {
        String token = request.getHeader("auth-token");
        if (token != null && token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        return jwtUtil.extractUsername(token);
    }
}
