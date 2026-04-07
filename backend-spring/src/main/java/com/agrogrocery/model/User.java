package com.agrogrocery.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;
import java.util.Map;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    private String name;
    private String email;
    private String password;
    private Map<String, Integer> cartData;
    private String address;
    private String avatar;
    private Date date;

    // Constructors
    public User() {
        this.date = new Date();
    }

    public User(String name, String email, String password, Map<String, Integer> cartData) {
        this();
        this.name = name;
        this.email = email;
        this.password = password;
        this.cartData = cartData;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Map<String, Integer> getCartData() {
        return cartData;
    }

    public void setCartData(Map<String, Integer> cartData) {
        this.cartData = cartData;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
