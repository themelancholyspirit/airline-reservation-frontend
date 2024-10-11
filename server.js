const express = require('express');
const cors = require('cors');
const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

// Your routes and other middleware go here

// Handle OPTIONS requests
app.options('*', cors());

// ... rest of your server code

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});