package com.agrogrocery.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Document(collection = "orders")
public class Order {
    @Id
    private String id;
    
    private String userId;
    private List<Map<String, Object>> items;
    private double amount;
    private Map<String, Object> address;
    private String status;
    private Date date;
    private boolean payment;
    private String paymentMethod; // "RAZORPAY" or "COD"

    // Constructors
    public Order() {
        this.date = new Date();
        this.status = "Order Processing";
        this.payment = false;
    }

    public Order(String userId, List<Map<String, Object>> items, 
                 double amount, Map<String, Object> address) {
        this();
        this.userId = userId;
        this.items = items;
        this.amount = amount;
        this.address = address;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<Map<String, Object>> getItems() {
        return items;
    }

    public void setItems(List<Map<String, Object>> items) {
        this.items = items;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Map<String, Object> getAddress() {
        return address;
    }

    public void setAddress(Map<String, Object> address) {
        this.address = address;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public boolean isPayment() {
        return payment;
    }

    public void setPayment(boolean payment) {
        this.payment = payment;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
