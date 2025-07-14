const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// JWT
const JWT_SECRET = 'your-secret-key-change-in-production';

// DB Setup
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
const dbName = 'super-market';

// Connect to MongoDB before operations
async function connectDB() {
  if (!client.topology?.isConnected()) {
    await client.connect();
  }
}

// Upload folder
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Save customer with image
const saveCustomer = async (req, res) => {
  try {
    await connectDB(); // <-- IMPORTANT
    const db = client.db(dbName);
    const collection = db.collection('customer');

    const { name, email, contact, age, location } = req.body;
    const photo = req.file ? req.file.filename : null;

    const newCustomer = {
      name,
      email,
      contact,
      age,
      location,
      photo,
      createdAt: new Date(),
    };

    const insertResult = await collection.insertOne(newCustomer);
    res.send(insertResult);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Failed to save customer' });
  }
};

const getAllCustomer = async (req, res) => {
  await connectDB();
  const db = client.db(dbName);
  const collection = db.collection('customer');
  const findResult = await collection.find({}).toArray();
  res.send(findResult);
};

const updateCustomer = async (req, res) => {
  await connectDB();
  const db = client.db(dbName);
  const collection = db.collection('customer');
  const updateResult = await collection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.send(updateResult);
};

const deleteCustomer = async (req, res) => {
  await connectDB();
  const db = client.db(dbName);
  const collection = db.collection('customer');
  const deleteResult = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
  res.send(deleteResult);
};

const getCustomerById = async (req, res) => {
  await connectDB();
  const db = client.db(dbName);
  const collection = db.collection('customer');
  const filteredDocs = await collection.findOne({ _id: new ObjectId(req.params.id) });
  res.send(filteredDocs);
};

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send({ error: 'Access token required' });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).send({ error: 'Invalid or expired token' });
  }
};

module.exports = {
  saveCustomer,
  getAllCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
  verifyToken,
  upload,
};
