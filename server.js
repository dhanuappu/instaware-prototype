require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- MONGODB CONNECTION ---
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

// 5. User Schema (Global Auth)
const userSchema = new mongoose.Schema({
  name: String,
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' }, // 'customer', 'vendor', 'superadmin'
  address: String,
});
const User = mongoose.model('User', userSchema);

// --- ROUTES ---

// ==========================================
// TEMPORARY SEED ROUTE (Run this once!)
// ==========================================
app.get('/api/seed-products', async (req, res) => {
  try {
    const dummyShopId = "64b7d8f9a12c3e4d5f6g7h8i"; 

    const seedProducts = [
      // 1. PREMIUM HOODIES
      { name: "Midnight Black Techwear Hoodie", brand: "Instawear Exclusives", price: 2499, image: "https://loremflickr.com/800/1000/hoodie,streetwear?random=1", deliveryTime: "2-3 Days", category: "Hoodies", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Oversized Vintage Wash Pullover", brand: "Urban Threads", price: 1899, image: "https://loremflickr.com/800/1000/hoodie,vintage?random=2", deliveryTime: "2-3 Days", category: "Hoodies", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Heavyweight Cotton Zip-Up", brand: "Essentials", price: 2199, image: "https://loremflickr.com/800/1000/hoodie,premium?random=3", deliveryTime: "1-2 Days", category: "Hoodies", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Arctic White Fleece Hoodie", brand: "Instawear Exclusives", price: 1999, image: "https://loremflickr.com/800/1000/hoodie,white?random=4", deliveryTime: "3-4 Days", category: "Hoodies", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Crimson Red Graphic Pullover", brand: "Street Culture", price: 1799, image: "https://loremflickr.com/800/1000/hoodie,red?random=5", deliveryTime: "2-3 Days", category: "Hoodies", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Olive Green Tactical Hoodie", brand: "TechApparel", price: 2899, image: "https://loremflickr.com/800/1000/hoodie,tactical?random=6", deliveryTime: "1-2 Days", category: "Hoodies", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Pastel Pink Drop-Shoulder Hoodie", brand: "Aesthetic Wear", price: 1599, image: "https://loremflickr.com/800/1000/hoodie,pastel?random=7", deliveryTime: "2-3 Days", category: "Hoodies", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Charcoal Grey Knit Hoodie", brand: "Luxe Comfort", price: 3299, image: "https://loremflickr.com/800/1000/hoodie,knit?random=8", deliveryTime: "3-5 Days", category: "Hoodies", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Neon Cyberpunk Graphic Hoodie", brand: "NeoTokyo", price: 2599, image: "https://loremflickr.com/800/1000/hoodie,cyberpunk?random=9", deliveryTime: "1-2 Days", category: "Hoodies", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Mocha Brown Suede Detail Hoodie", brand: "Instawear Exclusives", price: 3499, image: "https://loremflickr.com/800/1000/hoodie,brown?random=10", deliveryTime: "2-3 Days", category: "Hoodies", shopLocation: "Bangalore", shopId: dummyShopId },

      // 2. PREMIUM SNEAKERS
      { name: "Retro High-Top Basketball Kicks", brand: "Jumpman Classics", price: 12999, image: "https://loremflickr.com/800/1000/sneakers,jordans?random=11", deliveryTime: "3-4 Days", category: "Sneakers", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Minimalist White Leather Trainers", brand: "Luxe Footwear", price: 4599, image: "https://loremflickr.com/800/1000/sneakers,white?random=12", deliveryTime: "1-2 Days", category: "Sneakers", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Chunky 90s Dad Sneakers", brand: "Urban Threads", price: 3899, image: "https://loremflickr.com/800/1000/sneakers,chunky?random=13", deliveryTime: "2-3 Days", category: "Sneakers", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Carbon Fiber Running Shoes", brand: "AeroTech", price: 8999, image: "https://loremflickr.com/800/1000/sneakers,running?random=14", deliveryTime: "1-2 Days", category: "Sneakers", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Suede Skater Low-Tops", brand: "BoardWalk", price: 3499, image: "https://loremflickr.com/800/1000/sneakers,skate?random=15", deliveryTime: "3-5 Days", category: "Sneakers", shopLocation: "Bangalore", shopId: dummyShopId },

      // 3. PREMIUM WATCHES
      { name: "Obsidian Black Chronograph", brand: "Timepiece Co.", price: 7499, image: "https://loremflickr.com/800/1000/watch,luxury?random=16", deliveryTime: "1-2 Days", category: "Watches", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Silver Steel Diver's Watch", brand: "Oceanic", price: 11299, image: "https://loremflickr.com/800/1000/watch,steel?random=17", deliveryTime: "2-3 Days", category: "Watches", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Minimalist Leather Strap Watch", brand: "Classic Wear", price: 3999, image: "https://loremflickr.com/800/1000/watch,minimalist?random=18", deliveryTime: "2-3 Days", category: "Watches", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Rose Gold Smart Chrono", brand: "TechApparel", price: 8999, image: "https://loremflickr.com/800/1000/watch,rosegold?random=19", deliveryTime: "1-2 Days", category: "Watches", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Vintage Aviator Mechanical Watch", brand: "AeroTime", price: 14500, image: "https://loremflickr.com/800/1000/watch,vintage?random=20", deliveryTime: "3-5 Days", category: "Watches", shopLocation: "Bangalore", shopId: dummyShopId },

      // 4. PREMIUM T-SHIRTS
      { name: "Supima Cotton Crewneck - Black", brand: "Essentials", price: 999, image: "https://loremflickr.com/800/1000/tshirt,black?random=21", deliveryTime: "1-2 Days", category: "T-Shirts", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Oversized Acid Wash Graphic Tee", brand: "Street Culture", price: 1299, image: "https://loremflickr.com/800/1000/tshirt,graphic?random=22", deliveryTime: "2-3 Days", category: "T-Shirts", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Heavyweight Boxy Fit Tee - White", brand: "Instawear Exclusives", price: 1199, image: "https://loremflickr.com/800/1000/tshirt,white?random=23", deliveryTime: "1-2 Days", category: "T-Shirts", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Retro Logo Baseball Raglan", brand: "Vintage Supply", price: 1099, image: "https://loremflickr.com/800/1000/tshirt,raglan?random=24", deliveryTime: "2-3 Days", category: "T-Shirts", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Premium Linen Blend V-Neck", brand: "Luxe Comfort", price: 1599, image: "https://loremflickr.com/800/1000/tshirt,linen?random=25", deliveryTime: "3-4 Days", category: "T-Shirts", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Tie-Dye Festival Muscle Tee", brand: "Aesthetic Wear", price: 899, image: "https://loremflickr.com/800/1000/tshirt,tiedye?random=26", deliveryTime: "2-3 Days", category: "T-Shirts", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Textured Waffle-Knit Long Sleeve", brand: "Urban Threads", price: 1499, image: "https://loremflickr.com/800/1000/tshirt,longsleeve?random=27", deliveryTime: "1-2 Days", category: "T-Shirts", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Minimalist Pocket Tee - Olive", brand: "Essentials", price: 1049, image: "https://loremflickr.com/800/1000/tshirt,pocket?random=28", deliveryTime: "2-3 Days", category: "T-Shirts", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Cyber-Goth Printed Longline Tee", brand: "NeoTokyo", price: 1399, image: "https://loremflickr.com/800/1000/tshirt,cyber?random=29", deliveryTime: "2-3 Days", category: "T-Shirts", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Seamless Athletic Compression Tee", brand: "AeroTech", price: 1699, image: "https://loremflickr.com/800/1000/tshirt,athletic?random=30", deliveryTime: "1-2 Days", category: "T-Shirts", shopLocation: "Bangalore", shopId: dummyShopId },

      // 5. PREMIUM PANTS
      { name: "Techwear Cargo Joggers - Black", brand: "TechApparel", price: 2999, image: "https://loremflickr.com/800/1000/pants,cargo?random=31", deliveryTime: "1-2 Days", category: "Pants", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Selvedge Raw Denim Jeans", brand: "Heritage Denim Co.", price: 4599, image: "https://loremflickr.com/800/1000/jeans,denim?random=32", deliveryTime: "3-5 Days", category: "Pants", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Slim-Fit Chinos - Khaki", brand: "Classic Wear", price: 1999, image: "https://loremflickr.com/800/1000/pants,chinos?random=33", deliveryTime: "1-2 Days", category: "Pants", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Heavyweight Sweatpants - Grey", brand: "Essentials", price: 1899, image: "https://loremflickr.com/800/1000/sweatpants,grey?random=34", deliveryTime: "2-3 Days", category: "Pants", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Distressed Skinny Biker Jeans", brand: "Street Culture", price: 3299, image: "https://loremflickr.com/800/1000/jeans,biker?random=35", deliveryTime: "2-3 Days", category: "Pants", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Relaxed Fit Corduroy Trousers", brand: "Vintage Supply", price: 2499, image: "https://loremflickr.com/800/1000/pants,corduroy?random=36", deliveryTime: "3-4 Days", category: "Pants", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Performance Track Pants", brand: "AeroTech", price: 2199, image: "https://loremflickr.com/800/1000/pants,track?random=37", deliveryTime: "1-2 Days", category: "Pants", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Wide-Leg Skater Pants - Olive", brand: "BoardWalk", price: 2799, image: "https://loremflickr.com/800/1000/pants,skate?random=38", deliveryTime: "2-3 Days", category: "Pants", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Tailored Plaid Formal Trousers", brand: "Luxe Comfort", price: 3599, image: "https://loremflickr.com/800/1000/pants,plaid?random=39", deliveryTime: "2-4 Days", category: "Pants", shopLocation: "Bangalore", shopId: dummyShopId },
      { name: "Water-Resistant Hiking Cargo Pants", brand: "Instawear Exclusives", price: 3899, image: "https://loremflickr.com/800/1000/pants,hiking?random=40", deliveryTime: "1-2 Days", category: "Pants", shopLocation: "Bangalore", shopId: dummyShopId }
    ];

    await Product.deleteMany({}); 
    console.log("Cleared old products...");

    const inserted = await Product.insertMany(seedProducts);
    
    res.status(201).json({ 
      success: true, 
      message: `Successfully added ${inserted.length} premium products to MongoDB!`,
      data: inserted
    });

  } catch (err) {
    console.error("Seed Error:", err);
    res.status(500).json({ error: err.message });
  }
});


// SHOP ROUTE: Register a New Shop
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

// PRODUCT ROUTE: Get All
app.get('/api/products', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

// PRODUCT ROUTE: Get One
app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

// PRODUCT ROUTE: Add Product
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

// SUPER ADMIN ROUTE: Get ALL Orders
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

// ORDER ROUTE: Place a New Order
app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json({ success: true, orderId: newOrder._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ORDERS FOR A SPECIFIC VENDOR
app.get('/api/orders/shop/:shopId', async (req, res) => {
  try {
    const { shopId } = req.params;
    const orders = await Order.find({ "items.shopId": shopId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ORDER ROUTE: Update Status
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body; 
    await Order.findByIdAndUpdate(req.params.id, { status: status });
    res.json({ success: true, status: status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ORDER ROUTE: Get Orders for a Specific Customer (By Mobile)
app.get('/api/orders/customer/:mobile', async (req, res) => {
  try {
    const orders = await Order.find({ mobile: req.params.mobile }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET ORDERS BY USER MOBILE
app.get('/api/orders/user/:mobile', async (req, res) => {
  try {
    const { mobile } = req.params;
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

// --- AUTH: SIGNUP ROUTE ---
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, mobile, password, role } = req.body;
    const existingUser = await User.findOne({ mobile });
    if (existingUser) return res.status(400).json({ error: "Mobile number already registered" });

    const newUser = new User({ name, mobile, password, role: role || 'customer' });
    await newUser.save();
    
    res.json({ message: "Account created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- AUTH: LOGIN ROUTE ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const user = await User.findOne({ mobile });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.password !== password) return res.status(401).json({ error: "Invalid password" });

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

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Hyperlocal Server running on port ${PORT}`);
});
