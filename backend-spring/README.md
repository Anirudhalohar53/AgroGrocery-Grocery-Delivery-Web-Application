# AgroGrocery Spring Boot Backend

This is the Spring Boot version of the AgroGrocery grocery delivery backend, converted from Node.js/Express to Java Spring Boot.

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MongoDB running on localhost:27017

## Configuration

The application is configured to run on port 8080 (instead of 4000 in the original Node.js version).

### Application Properties

Key configurations in `src/main/resources/application.properties`:

- **Server Port**: 8080
- **MongoDB**: mongodb://localhost:27017/agrogrocery
- **JWT Secret**: secret_ecom_spring_boot
- **File Upload**: ./uploads/images
- **CORS**: Allows localhost:3000 and localhost:5173

## Running the Application

### Using Maven

```bash
cd backend-spring
mvn clean install
mvn spring-boot:run
```

### Using IDE

Run the `AgroGroceryApplication.java` main class directly.

## API Endpoints

The Spring Boot version maintains all the same API endpoints as the original Node.js version:

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/getuser` - Get user profile
- `PUT /api/auth/updateuser` - Update user profile

### Products
- `GET /api/allproducts` - Get all products
- `POST /api/addproduct` - Add new product
- `POST /api/removeproduct` - Remove product
- `PUT /api/updateproduct` - Update product
- `GET /api/newcollections` - Get new collections
- `GET /api/popularinfruits` - Get popular fruits

### Cart
- `POST /api/addtocart` - Add item to cart
- `POST /api/removefromcart` - Remove item from cart
- `POST /api/getcart` - Get cart items

### Reviews
- `POST /api/addreview` - Add product review
- `GET /api/reviews/{productId}` - Get product reviews

### Orders
- `POST /api/place` - Place order (with Stripe)
- `POST /api/verify` - Verify payment
- `POST /api/userorders` - Get user orders
- `GET /api/list` - Get all orders (admin)
- `POST /api/status` - Update order status

### File Upload
- `POST /api/upload` - Upload product images
- `GET /images/{filename}` - Serve uploaded images

## Key Differences from Node.js Version

1. **Port**: Runs on 8080 instead of 4000
2. **Authentication**: Uses Spring Security with JWT
3. **Database**: Uses Spring Data MongoDB
4. **File Upload**: Uses Spring's MultipartFile
5. **Error Handling**: More structured error responses
6. **Type Safety**: Full Java type safety

## Frontend Updates Required

When using this Spring Boot backend, update the frontend API calls:

1. Change base URL from `http://localhost:4000` to `http://localhost:8080/api`
2. All endpoint paths remain the same except they're prefixed with `/api`

## Security

- JWT tokens are used for authentication
- Password encryption with BCrypt
- CORS configured for frontend domains
- File upload restrictions in place

## Database Collections

The Spring Boot version uses the same MongoDB collections:
- `products` - Product information
- `users` - User accounts and cart data
- `reviews` - Product reviews
- `orders` - Order information

## Testing

Run the application and test endpoints:
- Health check: `GET http://localhost:8080/`
- Get products: `GET http://localhost:8080/api/allproducts`
