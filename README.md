AgroGrocery - Grocery Delivery Web App Synopsis
AgroGrocery is a comprehensive full-stack grocery delivery web application designed to connect customers with grocery products through an e-commerce platform.

Architecture Overview
Multi-tier Architecture:

Frontend (Customer): React.js with TailwindCSS (Port 3000)
Admin Panel: React.js with Vite (Separate admin interface)
Backend Options:
Node.js Express mock server (Port 8081)
Spring Boot with MongoDB (Alternative production backend)
Payment Gateway: Razorpay integration
Authentication: JWT-based security
Core Features
Customer Experience:

User registration/login with JWT authentication
Product browsing and search functionality
Shopping cart management with local state sync
Order placement with Razorpay payment processing
Review and rating system for products
Admin Capabilities:

Product management (add/update/remove products)
Order management and status tracking
User management and analytics
Inventory and stock management
Technical Stack
Frontend Technologies:

React 18.3.1 with React Router
Bootstrap 5.3.8 and TailwindCSS
FontAwesome icons and React Icons
Axios for API communication
EmailJS for contact functionality
Backend Technologies:

Node.js: Express, JWT, Bcrypt, Multer, CORS
Spring Boot: 3.2.0 with Java 17
MongoDB for data persistence
Spring Security for authentication
Razorpay Java SDK for payments
Data Flow Architecture
Key Entities:

Users (authentication, profiles, addresses)
Products (catalog management, pricing, categories)
Shopping Cart (local state + DB sync)
Orders (order processing, payment tracking)
Reviews (product ratings and feedback)
API Endpoints:

Authentication: /api/auth/*
Products: /api/allproducts, /api/addproduct
Cart: /api/addtocart, /api/getcart
Orders: /api/placeorder, /api/verify-payment
Development Setup
The project supports dual backend options:

Mock Backend: Node.js Express with in-memory storage for development
Production Backend: Spring Boot with MongoDB for scalable deployment
Database Schema:

MongoDB collections for users, products, orders, reviews, contacts
In-memory arrays for mock development environment
Key Integrations
Razorpay: Secure payment processing
JWT: Stateless authentication
EmailJS: Contact form functionality
File Upload: Product image management with Multer
