const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();
const PORT = 8081;
const JWT_SECRET = 'secret_ecom_spring_boot_secure_key_32_bytes_minimum';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/images', express.static('uploads'));

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// In-memory user storage (for testing)
let users = [];

// In-memory product storage (for testing)
let products = [
  {
    id: "1",
    productId: 1,
    name: "Lays Chips",
    image: "https://i.ibb.co/607VL1j/lays.jpg",
    category: "Fruits",
    new_price: 20,
    old_price: 25,
    description: "Crunchy potato chips"
  },
  {
    id: "2", 
    productId: 2,
    name: "Coca Cola",
    image: "https://i.ibb.co/3sVqQpF/coca-cola.jpg",
    category: "ColdDrinks",
    new_price: 40,
    old_price: 45,
    description: "Refreshing cola drink"
  }
];

// In-memory reviews storage (for testing)
let reviews = [
  {
    id: "1",
    productId: "1",
    userName: "John Doe",
    rating: 5,
    comment: "Great chips! Very crispy and tasty.",
    date: new Date().toISOString()
  },
  {
    id: "2", 
    productId: "1",
    userName: "Jane Smith",
    rating: 4,
    comment: "Good flavor, but a bit salty.",
    date: new Date().toISOString()
  }
];

// In-memory contacts storage (for testing)
let contacts = [];

// In-memory orders storage (for testing)
let orders = [];

// Helper functions
const generateToken = (email) => {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
};

const findUserByEmail = (email) => {
  return users.find(user => user.email === email);
};

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['auth-token'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.userEmail = user.email;
    next();
  });
};

// Routes
app.get('/api/', (req, res) => {
  res.json({ message: 'GrocerEase Mock Backend is Running' });
});

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    console.log('=== SIGNUP DEBUG ===');
    console.log('Email:', email);
    console.log('Username:', username);
    console.log('Password:', password ? '[PRESENT]' : '[NULL]');

    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        errors: 'Missing required fields'
      });
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        errors: 'existing User Found with same email address'
      });
    }

    // Create cart data
    const cartData = {};
    for (let i = 0; i < 300; i++) {
      cartData[String(i)] = 0;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: String(users.length + 1),
      name: username,
      email,
      password: hashedPassword,
      cartData,
      address: '',
      date: new Date()
    };

    users.push(newUser);
    console.log('User saved successfully:', newUser.email);

    // Generate token
    const token = generateToken(email);
    console.log('JWT token generated successfully.');

    res.json({
      success: true,
      token
    });

  } catch (error) {
    console.error('=== SIGNUP ERROR ===');
    console.error('Error during signup:', error.message);
    res.status(500).json({
      success: false,
      errors: 'Internal server error: ' + error.message
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('=== LOGIN DEBUG ===');
    console.log('Email:', email);
    console.log('Password:', password ? '[PRESENT]' : '[NULL]');

    const user = findUserByEmail(email);
    if (!user) {
      return res.json({
        success: false,
        errors: 'User Not Found'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({
        success: false,
        errors: 'Wrong Password'
      });
    }

    const token = generateToken(email);
    console.log('Login successful for:', email);

    res.json({
      success: true,
      token
    });

  } catch (error) {
    console.error('=== LOGIN ERROR ===');
    console.error('Error during login:', error.message);
    res.status(500).json({
      success: false,
      errors: 'Internal server error: ' + error.message
    });
  }
});

// Mock product routes
app.get('/api/allproducts', (req, res) => {
  res.json(products);
});

app.post('/api/removeproduct', (req, res) => {
  try {
    const { id } = req.body;
    console.log('Removing product with id:', id);
    
    const productIndex = products.findIndex(p => p.productId === parseInt(id));
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    const removedProduct = products.splice(productIndex, 1)[0];
    console.log('Product removed:', removedProduct.name);
    
    res.json({
      success: true,
      name: removedProduct.name
    });
  } catch (error) {
    console.error('Error removing product:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

app.put('/api/updateproduct', (req, res) => {
  try {
    const { id, name, old_price, new_price } = req.body;
    console.log('Updating product with id:', id);
    
    const product = products.find(p => p.productId === parseInt(id));
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    if (name) product.name = name;
    if (old_price) product.old_price = parseFloat(old_price);
    if (new_price) product.new_price = parseFloat(new_price);
    
    console.log('Product updated:', product.name);
    
    res.json({
      success: true,
      product: product
    });
  } catch (error) {
    console.error('Error updating product:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

// Add product endpoint
app.post('/api/addproduct', (req, res) => {
  try {
    const { name, image, category, new_price, old_price, description } = req.body;
    console.log('Adding new product:', name);
    
    const newProduct = {
      id: String(products.length + 1),
      productId: products.length + 1,
      name,
      image: image || "https://i.ibb.co/607VL1j/default-product.jpg",
      category,
      new_price: parseFloat(new_price),
      old_price: parseFloat(old_price),
      description: description || ""
    };
    
    products.push(newProduct);
    console.log('Product added successfully:', newProduct.name);
    
    res.json({
      success: true,
      product: newProduct
    });
  } catch (error) {
    console.error('Error adding product:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

// Mock image upload endpoint
app.post('/api/upload', upload.single('product'), (req, res) => {
  try {
    console.log('Mock image upload received:', req.file);
    
    // Mock successful upload with a placeholder image URL
    const mockImageUrl = `https://i.ibb.co/607VL1j/product-${Date.now()}.jpg`;
    
    res.json({
      success: true,
      image_url: mockImageUrl
    });
  } catch (error) {
    console.error('Error uploading image:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

// Reviews endpoints
app.get('/api/reviews/:productId', (req, res) => {
  try {
    const { productId } = req.params;
    console.log('Fetching reviews for productId:', productId);
    
    // Handle both string and number IDs, and MongoDB ObjectId-like formats
    let productReviews = reviews.filter(review => {
      // Try exact string match first
      if (review.productId === productId) return true;
      // Try converting both to string and compare
      if (String(review.productId) === String(productId)) return true;
      // Try converting productId to number and compare with productId field
      if (!isNaN(productId) && review.productId === parseInt(productId)) return true;
      return false;
    });
    
    console.log('Found reviews:', productReviews.length);
    res.json(productReviews);
  } catch (error) {
    console.error('Error fetching reviews:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

app.post('/api/addreview', (req, res) => {
  try {
    const { productId, userName, rating, comment } = req.body;
    console.log('Adding new review for product:', productId);
    
    const newReview = {
      id: String(reviews.length + 1),
      productId,
      userName,
      rating: parseInt(rating),
      comment,
      date: new Date().toISOString()
    };
    
    reviews.push(newReview);
    console.log('Review added successfully for product:', productId);
    
    res.json({
      success: true,
      review: newReview
    });
  } catch (error) {
    console.error('Error adding review:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

// Contact endpoints
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    console.log('Adding new contact from:', name);
    
    const newContact = {
      id: String(contacts.length + 1),
      name,
      email,
      phone: phone || '',
      subject,
      message,
      status: 'pending',
      date: new Date().toISOString()
    };
    
    contacts.push(newContact);
    console.log('Contact added successfully:', newContact.name);
    
    res.json(newContact);
  } catch (error) {
    console.error('Error adding contact:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

app.get('/api/contacts', (req, res) => {
  try {
    console.log('Fetching all contacts, count:', contacts.length);
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

app.get('/api/contacts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const contact = contacts.find(c => c.id === id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

app.put('/api/contacts/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const contactIndex = contacts.findIndex(c => c.id === id);
    if (contactIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    contacts[contactIndex].status = status;
    console.log('Contact status updated:', id, '->', status);
    
    res.json(contacts[contactIndex]);
  } catch (error) {
    console.error('Error updating contact status:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

app.delete('/api/contacts/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    const contactIndex = contacts.findIndex(c => c.id === id);
    if (contactIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }
    
    const deletedContact = contacts.splice(contactIndex, 1)[0];
    console.log('Contact deleted:', deletedContact.name);
    
    res.status(200).send();
  } catch (error) {
    console.error('Error deleting contact:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error: ' + error.message
    });
  }
});

// Order Management Endpoints
app.post('/api/place-cod', authenticateToken, (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userEmail = req.userEmail;
    const user = findUserByEmail(userEmail);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const newOrder = {
      id: String(orders.length + 1),
      userId: user.id,
      items,
      amount: parseFloat(amount),
      address,
      status: 'Order Processing',
      date: new Date(),
      payment: false,
      paymentMethod: 'COD'
    };

    orders.push(newOrder);
    console.log('COD order placed:', newOrder.id);

    res.json({
      success: true,
      orderId: newOrder.id,
      message: 'COD order placed successfully'
    });
  } catch (error) {
    console.error('Error placing COD order:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error placing COD order: ' + error.message
    });
  }
});

app.post('/api/userorders', authenticateToken, (req, res) => {
  try {
    const userEmail = req.userEmail;
    const user = findUserByEmail(userEmail);
    
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    const userOrders = orders.filter(order => order.userId === user.id);
    console.log('Fetching orders for user:', userEmail, 'Count:', userOrders.length);

    res.json({
      success: true,
      data: userOrders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error.message);
    res.json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

app.get('/api/list', (req, res) => {
  try {
    console.log('Fetching all orders, count:', orders.length);
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching all orders:', error.message);
    res.json({
      success: false,
      message: 'Error fetching orders'
    });
  }
});

app.post('/api/status', (req, res) => {
  try {
    const { orderId, status } = req.body;
    
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      return res.json({
        success: false,
        message: 'Order not found'
      });
    }

    orders[orderIndex].status = status;
    console.log('Order status updated:', orderId, '->', status);

    res.json({
      success: true,
      message: 'Status updated'
    });
  } catch (error) {
    console.error('Error updating order status:', error.message);
    res.json({
      success: false,
      message: 'Error updating status'
    });
  }
});

app.post('/api/cancel', authenticateToken, (req, res) => {
  try {
    const { orderId } = req.body;
    const userEmail = req.userEmail;
    const user = findUserByEmail(userEmail);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      return res.json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[orderIndex];
    
    // Check if order belongs to the current user
    if (order.userId !== user.id) {
      return res.json({
        success: false,
        message: 'Unauthorized to cancel this order'
      });
    }

    // Check if order can be cancelled (only if not delivered)
    if (order.status === 'Delivered') {
      return res.json({
        success: false,
        message: 'Cannot cancel delivered order'
      });
    }

    // Update order status to cancelled
    orders[orderIndex].status = 'Cancelled';
    console.log('Order cancelled:', orderId);

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling order:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order: ' + error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Mock backend server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /api/');
  console.log('  POST /api/auth/signup');
  console.log('  POST /api/auth/login');
  console.log('  GET  /api/allproducts');
  console.log('  POST /api/removeproduct');
  console.log('  PUT  /api/updateproduct');
  console.log('  POST /api/addproduct');
  console.log('  POST /api/upload');
  console.log('  POST /api/contact');
  console.log('  GET  /api/contacts');
  console.log('  GET  /api/contacts/:id');
  console.log('  PUT  /api/contacts/:id/status');
  console.log('  DELETE /api/contacts/:id');
  console.log('  POST /api/place-cod');
  console.log('  POST /api/userorders');
  console.log('  GET  /api/list');
  console.log('  POST /api/status');
  console.log('  POST /api/cancel');
});

module.exports = app;
