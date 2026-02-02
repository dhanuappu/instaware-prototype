const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// --- THE MEMORY BANK ---
// This acts as our database for now.
let products = [
    {
        id: 1,
        name: "Oversized Street Tee",
        brand: "KVM Est. 2025",
        price: 899,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
        deliveryTime: "45 mins"
    },
    {
        id: 2,
        name: "Vintage Cargo Pants",
        brand: "Instaware",
        price: 1499,
        image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7",
        deliveryTime: "55 mins"
    }
];

// 1. GET: Show all products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// 2. POST: Add a new product (The Admin Feature)
app.post('/api/products', (req, res) => {
    const newProduct = {
        id: Date.now(), // Generate a unique ID based on time
        name: req.body.name,
        brand: req.body.brand || "Instaware",
        price: Number(req.body.price),
        image: req.body.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
        deliveryTime: "60 mins"
    };
    products.push(newProduct); // Add to the array
    res.json(newProduct);
});

// 3. DELETE: Remove a product
app.delete('/api/products/:id', (req, res) => {
    const idToDelete = Number(req.params.id);
    products = products.filter(product => product.id !== idToDelete);
    res.json({ success: true });
});

app.listen(5000, () => {
    console.log("🚀 Server running on port 5000 (Admin Mode Enabled)");
});