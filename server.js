const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// --- MOCK DATABASE (Fake Memory) ---
const products = [
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
    },
    {
        id: 3,
        name: "Luxury Silk Shirt",
        brand: "Skill Edit",
        price: 2499,
        image: "https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6",
        deliveryTime: "30 mins"
    }
];

// Route to get products
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/', (req, res) => {
    res.send('Instaware Server is Running (Simulation Mode)');
});

app.listen(5000, () => {
    console.log("🚀 Server running on port 5000");
});