package com.agrogrocery.controller;

import com.agrogrocery.model.Product;
import com.agrogrocery.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("Express App Is Running");
    }

    @GetMapping("/allproducts")
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productRepository.findAll();
        System.out.println("All Products Fetched");
        return ResponseEntity.ok(products);
    }

    @PostMapping("/addproduct")
    public ResponseEntity<Map<String, Object>> addProduct(@RequestBody Product product) {
        List<Product> products = productRepository.findAll();
        int newId;
        if (!products.isEmpty()) {
            Product lastProduct = products.get(products.size() - 1);
            newId = lastProduct.getProductId() + 1;
        } else {
            newId = 1;
        }
        
        product.setProductId(newId);
        Product savedProduct = productRepository.save(product);
        System.out.println("Product saved: " + savedProduct);
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "name", product.getName()
        ));
    }

    @PostMapping("/removeproduct")
    public ResponseEntity<Map<String, Object>> removeProduct(@RequestBody Map<String, Object> request) {
        Integer productId = (Integer) request.get("id");
        productRepository.deleteByProductId(productId);
        System.out.println("Removed product with id: " + productId);
        
        return ResponseEntity.ok(Map.of(
            "success", true,
            "name", request.get("name")
        ));
    }

    @PutMapping("/updateproduct")
    public ResponseEntity<Map<String, Object>> updateProduct(@RequestBody Map<String, Object> request) {
        try {
            Integer id = (Integer) request.get("id");
            String name = (String) request.get("name");
            
            // Handle string to Double conversion for prices
            Double oldPrice = null;
            Double newPrice = null;
            
            if (request.get("old_price") != null) {
                if (request.get("old_price") instanceof String) {
                    oldPrice = Double.parseDouble((String) request.get("old_price"));
                } else {
                    oldPrice = ((Number) request.get("old_price")).doubleValue();
                }
            }
            
            if (request.get("new_price") != null) {
                if (request.get("new_price") instanceof String) {
                    newPrice = Double.parseDouble((String) request.get("new_price"));
                } else {
                    newPrice = ((Number) request.get("new_price")).doubleValue();
                }
            }

            Product product = productRepository.findByProductId(id);
            if (product == null) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", "Product not found"
                ));
            }

            product.setName(name);
            if (oldPrice != null) {
                product.setOld_price(oldPrice);
            }
            if (newPrice != null) {
                product.setNew_price(newPrice);
            }
            
            Product updatedProduct = productRepository.save(product);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "product", updatedProduct
            ));
        } catch (Exception e) {
            System.err.println("Error updating product: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Internal server error: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/newcollections")
    public ResponseEntity<List<Product>> getNewCollections() {
        List<Product> products = productRepository.findAll();
        List<Product> newCollection;
        if (products.size() > 1) {
            newCollection = products.subList(1, Math.min(products.size(), 9));
            if (newCollection.size() > 8) {
                newCollection = newCollection.subList(newCollection.size() - 8, newCollection.size());
            }
        } else {
            newCollection = products;
        }
        System.out.println("New collection Fetched");
        return ResponseEntity.ok(newCollection);
    }

    @GetMapping("/popularinfruits")
    public ResponseEntity<List<Product>> getPopularInFruits() {
        List<Product> products = productRepository.findByCategory("Fruits");
        List<Product> popularInFruits = products.stream().limit(4).toList();
        System.out.println("Popular in Fruits fetched");
        return ResponseEntity.ok(popularInFruits);
    }

    @PutMapping("/updatestock")
    public ResponseEntity<Map<String, Object>> updateStock(@RequestBody Map<String, Object> request) {
        try {
            Integer id = (Integer) request.get("id");
            Integer stock = (Integer) request.get("stock");
            
            if (stock == null || stock < 0) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Invalid stock value"
                ));
            }

            Product product = productRepository.findByProductId(id);
            if (product == null) {
                return ResponseEntity.status(404).body(Map.of(
                    "success", false,
                    "message", "Product not found"
                ));
            }

            product.setStock(stock);
            Product updatedProduct = productRepository.save(product);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "product", updatedProduct
            ));
        } catch (Exception e) {
            System.err.println("Error updating stock: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Internal server error: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/stockstatus")
    public ResponseEntity<Map<String, Object>> getStockStatus() {
        try {
            List<Product> products = productRepository.findAll();
            int totalProducts = products.size();
            int lowStockItems = 0;
            double totalStockValue = 0;
            
            for (Product product : products) {
                if (product.getStock() <= 20) {
                    lowStockItems++;
                }
                totalStockValue += product.getStock() * product.getNew_price();
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "totalProducts", totalProducts,
                "lowStockItems", lowStockItems,
                "totalStockValue", totalStockValue,
                "products", products
            ));
        } catch (Exception e) {
            System.err.println("Error getting stock status: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Internal server error: " + e.getMessage()
            ));
        }
    }
}
