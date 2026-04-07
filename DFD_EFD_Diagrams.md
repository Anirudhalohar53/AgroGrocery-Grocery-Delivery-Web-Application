# GrocerEase - Data Flow Diagram (DFD) & Entity Flow Diagram (EFD)

## System Architecture Overview

GrocerEase is a full-stack grocery delivery web application with:
- **Frontend**: React.js (Port 3000)
- **Backend**: Node.js Express Mock Server (Port 8081) + Spring Boot (Alternative)
- **Database**: MongoDB (Spring Boot) / In-memory (Mock)
- **Payment**: Razorpay Integration
- **Authentication**: JWT Tokens

---

## Data Flow Diagram (DFD)

### Level 0 - Context Diagram
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│                 │    │                  │    │                 │
│   CUSTOMER      │◄──►│   GROCEREASE     │◄──►│   ADMIN         │
│                 │    │     SYSTEM       │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                           │
                           ▼
                   ┌──────────────────┐
                   │                  │
                   │   PAYMENT GATEWAY│
                   │    (RAZORPAY)    │
                   │                  │
                   └──────────────────┘
```

### Level 1 - System Overview
```
┌─────────────────────────────────────────────────────────────────┐
│                        GROCEREASE SYSTEM                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐     │
│  │              │    │              │    │              │     │
│  │  AUTH &      │    │  PRODUCT     │    │   ORDER      │     │
│  │  USER MGMT   │◄──►│  MANAGEMENT  │◄──►│  PROCESSING  │     │
│  │              │    │              │    │              │     │
│  └──────────────┘    └──────────────┘    └──────────────┘     │
│           │                   │                   │            │
│           ▼                   ▼                   ▼            │
│  ┌───────────────────────────────────────────────────────┐     │
│  │                  DATABASE LAYER                      │     │
│  │  (MongoDB / In-memory Storage)                       │     │
│  └───────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

### Level 2 - Detailed Data Flows

#### Authentication & User Management Flow
```
┌──────────┐  Login/Signup  ┌──────────────┐  JWT Token  ┌──────────┐
│          │──────────────►│              │─────────────►│          │
│ CUSTOMER │                │ AUTH SERVICE │              │ DATABASE │
│          │◄──────────────│              │◄─────────────│          │
└──────────┘  User Data     └──────────────┘  User Info  └──────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │              │
                     │ TOKEN STORE  │
                     │ (localStorage)│
                     └──────────────┘
```

#### Product Management Flow
```
┌──────────┐  Browse/Search  ┌──────────────┐  Product Data  ┌──────────┐
│          │───────────────►│              │──────────────►│          │
│ CUSTOMER │                │ PRODUCT API │                │ DATABASE │
│          │◄───────────────│              │◄──────────────│          │
└──────────┐  Product List   └──────────────┘  Products     └──────────┘
     │
     ▼
┌──────────────┐
│              │
│ SHOPPING CART│
│              │
└──────────────┘
```

#### Order Processing Flow
```
┌──────────┐  Place Order  ┌──────────────┐  Order Data  ┌──────────┐
│          │──────────────►│              │─────────────►│          │
│ CUSTOMER │                │ ORDER API    │              │ DATABASE │
│          │◄──────────────│              │◄─────────────│          │
└──────────┘  Order Status  └──────────────┘  Status      └──────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │              │
                     │ RAZORPAY API │
                     │              │
                     └──────────────┘
```

---

## Entity Flow Diagram (EFD)

### Core Entities & Relationships
```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│                 │       │                 │       │                 │
│     USER        │◄──────┤      CART       │──────►│     PRODUCT     │
│                 │ 1:N   │                 │  N:M   │                 │
└─────────────────┘       └─────────────────┘       └─────────────────┘
│ userId          │       │ cartId          │       │ productId       │
│ email           │       │ userId          │       │ name            │
│ password        │       │ items           │       │ price           │
│ name            │       │ totalAmount     │       │ category        │
│ address         │       │ createdAt       │       │ image           │
│ cartData        │       └─────────────────┘       │ description     │
└─────────────────┘               │                 └─────────────────┘
         │                         │                          │
         │ 1:N                     │ 1:N                      │ 1:N
         ▼                         ▼                          ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│                 │       │                 │       │                 │
│     ORDER       │       │   CART_ITEM     │       │    REVIEW       │
│                 │       │                 │       │                 │
└─────────────────┘       └─────────────────┘       └─────────────────┘
│ orderId         │       │ cartItemId      │       │ reviewId        │
│ userId          │       │ cartId          │       │ productId       │
│ items           │       │ productId       │       │ userId          │
│ totalAmount     │       │ quantity        │       │ rating          │
│ status          │       │ price           │       │ comment         │
│ paymentId       │       │ addedAt         │       │ date            │
│ shippingAddress │       └─────────────────┘       └─────────────────┘
│ createdAt       │
└─────────────────┘
```

### Entity Flow Processes

#### User Registration Flow
```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│              │    │              │    │              │    │              │
│ USER INPUT   │───►│ VALIDATION   │───►│ HASH PASSWORD│───►│ SAVE USER    │
│              │    │              │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │              │
                    │ GENERATE JWT │
                    │              │
                    └──────────────┘
```

#### Shopping Cart Flow
```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│              │    │              │    │              │    │              │
│ ADD TO CART  │───►│ UPDATE LOCAL │───►│ SYNC TO DB  │───►│ UPDATE UI    │
│              │    │ STATE        │    │              │    │              │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │              │
                    │ SHOW MESSAGE │
                    │              │
                    └──────────────┘
```

#### Order Placement Flow
```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│              │    │              │    │              │    │              │
│ CART ITEMS   │───►│ CALCULATE   │───►│ CREATE ORDER│───►│ PROCESS      │
│              │    │ TOTAL       │    │              │    │ PAYMENT      │
└──────────────┘    └──────────────┘    └──────────────┘    └──────────────┘
                           │                   │
                           ▼                   ▼
                    ┌──────────────┐    ┌──────────────┐
                    │              │    │              │
                    │ CLEAR CART   │    │ UPDATE STOCK │
                    │              │    │              │
                    └──────────────┘    └──────────────┘
```

---

## API Data Flow Mapping

### Authentication Endpoints
```
POST /api/auth/signup
Input: {email, username, password}
Process: Validate → Hash → Save → Generate JWT
Output: {success: true, token}

POST /api/auth/login  
Input: {email, password}
Process: Validate → Compare → Generate JWT
Output: {success: true, token}
```

### Product Endpoints
```
GET /api/allproducts
Process: Fetch from DB → Return array
Output: [{id, name, price, category, image}]

POST /api/addproduct
Input: {name, category, price, description}
Process: Validate → Save → Return product
Output: {success: true, product}

PUT /api/updateproduct
Input: {id, name, price}
Process: Find → Update → Return updated
Output: {success: true, product}

DELETE /api/removeproduct
Input: {id}
Process: Find → Delete → Confirm
Output: {success: true, name}
```

### Cart Endpoints
```
POST /api/addtocart
Headers: {auth-token}
Input: {itemId}
Process: Authenticate → Update cart → Sync
Output: Success response

POST /api/removefromcart
Headers: {auth-token}
Input: {itemId}
Process: Authenticate → Update cart → Sync
Output: Success response

POST /api/getcart
Headers: {auth-token}
Process: Authenticate → Fetch cart
Output: {cartItems}
```

### Order & Payment Endpoints
```
POST /api/placeorder
Headers: {auth-token}
Input: {items, totalAmount, address}
Process: Validate → Create order → Initiate payment
Output: {orderId, paymentId}

POST /api/verify-payment
Input: {paymentId, orderId, signature}
Process: Verify with Razorpay → Update order status
Output: {success: true, verified: true}
```

---

## Data Storage Architecture

### MongoDB Collections (Spring Boot)
```
users: {
  _id, email, password, name, address, cartData, date
}

products: {
  _id, name, category, new_price, old_price, image, description
}

orders: {
  _id, userId, items, totalAmount, status, paymentId, createdAt
}

reviews: {
  _id, productId, userName, rating, comment, date
}

contacts: {
  _id, name, email, phone, subject, message, status, date
}
```

### In-Memory Storage (Mock Backend)
```
users: Array<User>
products: Array<Product>  
reviews: Array<Review>
contacts: Array<Contact>
```

---

## Security & Data Flow

### JWT Token Flow
```
Login → Generate JWT → Store in localStorage → 
Include in API headers → Verify on backend → 
Allow/Deny access
```

### Data Validation Flow
```
Input Validation → Sanitization → Business Rules → 
Database Validation → Response
```

---

## Technology Stack Data Flow

### Frontend Data Flow
```
React Components → Context API → API Calls → 
Backend → Database → Response → State Update → UI Re-render
```

### Backend Data Flow
```
API Routes → Middleware → Controllers → 
Service Layer → Database → Response → Client
```

This DFD and EFD documentation provides a comprehensive view of how data flows through the GrocerEase system, from user interactions to database storage and back.
