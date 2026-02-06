require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));


// Paste this ONE long line inside the parenthesis
mongoose.connect('mongodb://dhanushappu733_db_user:Dhanu2001@ac-egnrgj8-shard-00-00.pd8birm.mongodb.net:27017,ac-egnrgj8-shard-00-01.pd8birm.mongodb.net:27017,ac-egnrgj8-shard-00-02.pd8birm.mongodb.net:27017/?ssl=true&authSource=admin')
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error:", err));
// --- SCHEMAS (The Blueprints) ---

// 1. The Shop (Vendor)
const shopSchema = new mongoose.Schema({
  shopName: String,
  ownerName: String,
  mobile: String, // This will be their Login ID
  password: String, // Simple password for now
  location: String, // e.g., "Indiranagar", "KR Puram"
  image: String,
  status: { type: String, default: "active" } // active/inactive
});
const Shop = mongoose.model('Shop', shopSchema);

// 2. The Product
const productSchema = new mongoose.Schema({
  name: String,
  brand: String,
  price: Number,
  image: String,
  deliveryTime: String,
  category: String,
  // LINK: Every product now belongs to a specific Shop ID
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }, 
  shopLocation: String, 
  createdAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', productSchema);

// 3. The Order (Upgraded for Cart)
const orderSchema = new mongoose.Schema({
  customerName: String,
  mobile: String,
  address: String,
  
  // NEW: We store a list of items
  items: [{
    productId: String,
    productName: String,
    price: Number,
    shopId: String,
    quantity: { type: Number, default: 1 }
  }],
  
  totalAmount: Number, // Grand Total
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', orderSchema);

// 4. The Customer
const customerSchema = new mongoose.Schema({
  name: String,
  mobile: String, // Login ID
  password: String,
  address: String, // Default address
  createdAt: { type: Date, default: Date.now }
});
const Customer = mongoose.model('Customer', customerSchema);

// --- ROUTES ---

// SHOP ROUTE: Register a New Shop (Partner Onboarding)
app.post('/api/shops/register', async (req, res) => {
  try {
    const newShop = new Shop(req.body);
    const savedShop = await newShop.save();
    res.json(savedShop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SHOP ROUTE: Login for Shop Owner
app.post('/api/shops/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const shop = await Shop.findOne({ mobile, password });
    if (shop) {
      res.json({ success: true, shopId: shop._id, shopName: shop.shopName });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PRODUCT ROUTE: Get All (For Customer Home Page)
app.get('/api/products', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// PRODUCT ROUTE: Get One (For Details Page)
app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

// PRODUCT ROUTE: Add Product (Now requires Shop ID)
app.post('/api/products', async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.json(newProduct);
});

// PRODUCT ROUTE: Delete
app.delete('/api/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// SUPER ADMIN ROUTE: Get ALL Orders across the platform
app.get('/api/admin/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SUPER ADMIN: Get All Shops
app.get('/api/shops', async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ORDER ROUTE: Place a New Order (Customer)
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json({ success: true, orderId: newOrder._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ORDERS FOR A SPECIFIC VENDOR (Shop Dashboard)
app.get('/api/orders/shop/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    // Magic Query: Find orders where the 'items' array contains an item with this shopId
    const orders = await Order.find({ "items.shopId": shopId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ORDER ROUTE: Get Orders for a Specific Shop (Cart Compatible)
app.get('/api/orders/shop/:shopId', async (req, res) => {
  try {
    const shopId = req.params.shopId;
    
    // 1. Find orders where "items" array contains an item with this shopId
    const orders = await Order.find({ "items.shopId": shopId }).sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ORDER ROUTE: Update Status (Vendor Action)
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body; // e.g., "Out for Delivery"
    await Order.findByIdAndUpdate(req.params.id, { status: status });
    res.json({ success: true, status: status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ORDER ROUTE: Get Orders for a Specific Customer (By Mobile)
app.get('/api/orders/customer/:mobile', async (req, res) => {
  try {
    // Find orders matching the mobile number, sorted by newest first
    const orders = await Order.find({ mobile: req.params.mobile }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ORDERS BY USER MOBILE (For "My Orders" Page)
app.get('/api/orders/user/:mobile', async (req, res) => {
  try {
    const { mobile } = req.params;
    // Find orders where the 'mobile' field matches the user's mobile
    const orders = await Order.find({ mobile: mobile }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CUSTOMER: Register
app.post('/api/customers/register', async (req, res) => {
  try {
    const newUser = new Customer(req.body);
    const savedUser = await newUser.save();
    res.json({ success: true, user: savedUser });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// CUSTOMER: Login
app.post('/api/customers/login', async (req, res) => {
  const { mobile, password } = req.body;
  const user = await Customer.findOne({ mobile, password });
  if (user) {
    res.json({ success: true, user: user });
  } else {
    res.json({ success: false, message: "Invalid User" });
  }
});

// --- 1. DEFINE USER SCHEMA ---
const userSchema = new mongoose.Schema({
  name: String,
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' }, // 'customer', 'vendor', 'superadmin'
  address: String,
});
const User = mongoose.model('User', userSchema);

// --- 2. SIGNUP ROUTE (Create Account) ---
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, mobile, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) return res.status(400).json({ error: "Mobile number already registered" });

    // Create new user
    const newUser = new User({ name, mobile, password, role: role || 'customer' });
    await newUser.save();
    
    res.json({ message: "Account created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- 3. LOGIN ROUTE (Check Credentials) ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    
    // Find user by mobile
    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check password (In a real app, use hashing here!)
    if (user.password !== password) return res.status(401).json({ error: "Invalid password" });

    // Send back user info
    res.json({ 
        message: "Login successful", 
        user: { 
            name: user.name, 
            mobile: user.mobile, 
            role: user.role,
            _id: user._id 
        } 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Hyperlocal Server running on port ${PORT}`);
});