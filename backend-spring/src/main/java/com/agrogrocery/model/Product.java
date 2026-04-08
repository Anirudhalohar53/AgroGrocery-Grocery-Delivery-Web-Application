package com.agrogrocery.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "products")
public class Product {
    @Id
    private String id;
    
    private int productId;
    private String name;
    private String image;
    private String category;
    private double new_price;
    private double old_price;
    private Date date;
    private boolean available;
    private String description;
    private int stock;
    private String unit; // kg, g, pcs, etc.

    // Constructors
    public Product() {
        this.date = new Date();
        this.available = true;
        this.stock = 0;
        this.unit = "kg"; // Default unit
    }

    public Product(int productId, String name, String image, String category, 
                   double new_price, double old_price, String description) {
        this();
        this.productId = productId;
        this.name = name;
        this.image = image;
        this.category = category;
        this.new_price = new_price;
        this.old_price = old_price;
        this.description = description;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public int getProductId() {
        return productId;
    }

    public void setProductId(int productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getNew_price() {
        return new_price;
    }

    public void setNew_price(double new_price) {
        this.new_price = new_price;
    }

    public double getOld_price() {
        return old_price;
    }

    public void setOld_price(double old_price) {
        this.old_price = old_price;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}
