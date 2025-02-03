const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Optional: Enable CORS for frontend-backend development
app.use(cors());

// Dummy users array for testing (in a real app, this would be a database)
let users = [];

// Register Route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user
  const newUser = { id: Date.now(), name, email, password: hashedPassword };
  users.push(newUser);

  res.status(201).json({ message: 'User registered successfully' });
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find the user
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // Create JWT token
  const token = jwt.sign(
    { userId: user.id, email: user.email }, // Payload
    process.env.JWT_SECRET, // Secret key
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Expiration time (default 1 hour)
  );

  res.json({ message: 'Login successful', token });
});

// Protected Route (fetches user data - secured with JWT)
app.get('/users', authenticateJWT, (req, res) => {
  // Fetch the user data only if JWT is valid
  const currentUser = users.find(user => user.id === req.user.userId);
  if (!currentUser) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Respond with the user data (omit password for security)
  const userData = {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
  };

  res.json(userData); // Send the user data as JSON
});

// Middleware to authenticate JWT token
function authenticateJWT(req, res, next) {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Token required' });

  // Verify token using the secret key from environment variables
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is not valid' });
    req.user = user; // Attach user to the request object
    next(); // Pass the request to the next middleware/route handler
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
