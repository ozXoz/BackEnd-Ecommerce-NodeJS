const express = require('express');
const mongoose = require('mongoose');
const authenticateToken = require('./middleware/authenticateToken');
const BlacklistedToken = require('./models/BlacklistedToken');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const stripetRoutes = require('./routes/stripe');
const cartRoutes=require('./routes/cart');
const orderRoutes=require('./routes/order');
const cors = require('cors'); // Add this line

console.log(process.env.JWT_SECRET);


const app = express();
const PORT = 3333; // Change the port number as needed

// app.use(cors()); // Add this line

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // Enable credentials (cookies, authorization headers, etc)
}));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// MongoDB connection
mongoose.connect("mongodb+srv://e_commerce:Azr2010q+@cluster0.br3gnsk.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
app.use(express.json())

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define your routes and middlewarex`
// Example route
app.get('/test', (req, res) => {
  res.send('Hello, World!');
  console.log("Test is passed !")
  
});
require('dotenv').config();

app.get('/api/protected-route', authenticateToken, (req, res) => {
  // Handle the protected route logic
  res.send('You accessed the protected route');
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/checkout', stripetRoutes);






// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
