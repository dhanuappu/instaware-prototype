require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// ==========================================
// 1. CORS CONFIGURATION (Fix for Vercel)
// ==========================================
// Add your live Vercel URL to this array so Render allows it to connect!
const allowedOrigins = [
  'http://localhost:3000', // Allows local testing
  'https://your-project-name.vercel.app', // REPLACE THIS with your actual Vercel URL!
  process.env.FRONTEND_URL // Optional fallback
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman) or if the origin is in our allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// ==========================================
// 2. MONGODB CONNECTION
// ==========================================
const dbURI = process.env.MONGO_URI;

if (!dbURI) {
  console.error("❌ CRITICAL ERROR: MONGO_URI is missing from environment variables.");
  process.exit(1);
}

mongoose.connect(dbURI)
  .then(() => console.log("✅ MongoDB Atlas Connected Successfully"))
  .catch(err => {
    console.error("❌ CRITICAL DB Error. Could not connect:", err.message);
    process.exit(1);
  });

// ==========================================
// 3. SCHEMAS (The Blueprints)
// ==========================================

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

// 4. The Customer (Legacy - being replaced by User Schema)
const customerSchema = new mongoose.Schema({
  name: String,
  mobile: String, // Login ID
  password: String,
  address: String, // Default address
  createdAt: { type: Date, default: Date.now }
});
const Customer = mongoose.model('Customer', customerSchema);

// 5. The Unified User Schema (Role-based Auth)
const userSchema = new mongoose.Schema({
  name: String,
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' }, // 'customer', 'vendor', 'superadmin'
  address: String,
});
const User = mongoose.model('User', userSchema);

// ==========================================
// 4. ROUTES
// ==========================================

// --- SHOP/VENDOR ROUTES ---
app.post('/api/shops/register', async (req, res) => {
  try {
    const newShop = new Shop(req.body);
    const savedShop = await newShop.save();
    res.json(savedShop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

app.get('/api/shops', async (req, res) => {
  try {
    const shops = await Shop.find();
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- PRODUCT ROUTES ---
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ORDER ROUTES ---
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json({ success: true, orderId: newOrder._id
