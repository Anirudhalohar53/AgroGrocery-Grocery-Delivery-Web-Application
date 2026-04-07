package com.agrogrocery.controller;

import com.agrogrocery.model.Product;
import com.agrogrocery.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class DataInitController {

    @Autowired
    private ProductRepository productRepository;

    @PostMapping("/init-data")
    public ResponseEntity<String> initData() {
        // Clear existing products
        productRepository.deleteAll();
        
        // Add sample products
        List<Product> products = Arrays.asList(
            new Product(1, "Lays Potato Chips", "https://i.ibb.co/607VL1j/lays.jpg", "Fruits", 15.0, 20.0, "Classic potato chips with amazing taste"),
            new Product(2, "Doritos Nacho Cheese", "https://i.ibb.co/0yGqTmP/doritos.jpg", "Fruits", 20.0, 25.0, "Bold nacho cheese flavored tortilla chips"),
            new Product(3, "Coca Cola 500ml", "https://i.ibb.co/3sVqQpF/coca-cola.jpg", "ColdDrinks", 35.0, 40.0, "Refreshing cola drink"),
            new Product(4, "Fresh Tomatoes", "https://i.ibb.co/4pDyXhJ/tomatoes.jpg", "Vegetables", 25.0, 30.0, "Fresh red tomatoes"),
            new Product(5, "Organic Carrots", "https://i.ibb.co/6yQkGQ2/carrots.jpg", "Vegetables", 30.0, 35.0, "Fresh organic carrots"),
            new Product(6, "Dish Soap", "https://i.ibb.co/9qJg8Zk/dish-soap.jpg", "HouseHolds", 100.0, 120.0, "Effective dish cleaning liquid"),
            new Product(7, "Laundry Detergent", "https://i.ibb.co/7Yp8gK2/detergent.jpg", "HouseHolds", 200.0, 250.0, "Powerful laundry detergent"),
            new Product(8, "Pepsi 500ml", "https://i.ibb.co/8xXvY7F/pepsi.jpg", "ColdDrinks", 35.0, 40.0, "Refreshing cola drink"),
            new Product(9, "Fresh Onions", "https://i.ibb.co/9yZqW4n/onions.jpg", "Vegetables", 20.0, 25.0, "Fresh red onions"),
            new Product(10, "Bingo Chips", "https://i.ibb.co/10XyZ5b/bingo.jpg", "Fruits", 15.0, 20.0, "Tasty potato chips")
        );
        
        productRepository.saveAll(products);
        
        return ResponseEntity.ok("Sample data initialized successfully!");
    }
}
