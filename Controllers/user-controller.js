const { MongoClient ,ObjectId } = require('mongodb');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// JWT Secret Key (in production, use environment variable)
const JWT_SECRET = 'your-secret-key-change-in-production';

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'super-market';


const db = client.db(dbName);
const collection = db.collection('users');


const saveUsers = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if any field is missing
    if (!username || !email || !password) {
      return res.status(400).send({ error: "Username, email, and password are required" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

    // Create user object with hashed password
    const newUser = {
      username,
      email,
      password: hashedPassword,
    };

    const insertResult = await collection.insertOne(newUser);
    res.send(insertResult);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to register user" });
  }
};




// const saveUsers = async(req, res) => {
//    const insertResult = await collection.insertOne(req.body);
//    res.send(insertResult);


// }

const getAllUsers  = async(req, res) => {
    const findResult = await collection.find({}).toArray();
    res.send(findResult);

}


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await collection.findOne({ email });
    if (!user) return res.status(401).send({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        username: user.username 
      },
      JWT_SECRET,
      { expiresIn: '24h' } // Token expires in 24 hours
    );

    res.send({ 
      message: "Login successful", 
      userId: user._id,
      token: token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Login failed" });
  }
};

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).send({ error: "Access token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Add user info to request object
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).send({ error: "Invalid or expired token" });
  }
};

module.exports = {
    saveUsers,
    getAllUsers,
    loginUser,
    verifyToken
}