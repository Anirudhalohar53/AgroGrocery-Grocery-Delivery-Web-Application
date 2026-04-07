package com.agrogrocery.controller;

import com.agrogrocery.model.Review;
import com.agrogrocery.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @PostMapping("/addreview")
    public ResponseEntity<Map<String, Object>> addReview(@RequestBody Review review) {
        Review savedReview = reviewRepository.save(review);
        System.out.println("Review Added");
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Review added successfully"
        ));
    }

    @GetMapping("/reviews/{productId}")
    public ResponseEntity<List<Review>> getReviewsByProductId(@PathVariable int productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        return ResponseEntity.ok(reviews);
    }
}
