

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');

const app = express();


app.use(cors({
  origin: [
    'http://localhost:5173',               // frontend dev
    'https://yozo-frontend.vercel.app'    // frontend production
  ],
  credentials: true // allow cookies to be sent
}));

// -------------------- Middlewares --------------------
app.use(cookieParser());   // Parse cookies
app.use(express.json());   // Parse JSON bodies

// -------------------- Test Route --------------------
app.get('/', (req, res) => {
  res.send('Hello world');
});

// -------------------- Routes --------------------
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

module.exports = app;
