const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
const uri = "mongodb+srv://shelfuser:Soccer123@cluster0.smdvj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

let usersCollection;

// Connect to MongoDB
client.connect().then(() => {
  const db = client.db('final');
  usersCollection = db.collection('users');
  console.log('Connected to MongoDB');
}).catch(err => console.error('Failed to connect to MongoDB:', err));

// Registration endpoint
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send('Username and password are required.');

  const existingUser = await usersCollection.findOne({ username });
  if (existingUser) return res.status(400).send('User already exists.');

  const hashedPassword = await bcrypt.hash(password, 10);
  await usersCollection.insertOne({ username, password: hashedPassword, name: '', bio: '' });
  res.status(201).send('User registered successfully.');
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await usersCollection.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).send('Invalid username or password.');
  }

  res.status(200).json({ message: 'Login successful', user: { username: user.username, name: user.name, bio: user.bio } });
});

// Update profile endpoint
app.post('/update-profile', async (req, res) => {
  const { username, name, bio } = req.body;

  const result = await usersCollection.updateOne(
    { username },
    { $set: { name, bio } }
  );

  if (result.modifiedCount > 0) {
    res.status(200).send('Profile updated successfully.');
  } else {
    res.status(400).send('Failed to update profile.');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});