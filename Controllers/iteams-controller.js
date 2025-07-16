const { MongoClient ,ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// JWT Secret Key (should match the one in user-controller.js)
const JWT_SECRET = 'your-secret-key-change-in-production';

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'super-market';


const db = client.db(dbName);
const collection = db.collection('items');

// Upload folder for items
const uploadDir = path.join(__dirname, '..', 'upload-iteams');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config for items
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


const saveItems = async (req, res) => {
  const { name, price, quantity } = req.body;
  const photo = req.file ? req.file.filename : null;

  const newItem = {
    name,
    price,
    quantity,
    photo,
    createdAt: new Date(),
  };

  const insertResult = await collection.insertOne(newItem);
  res.send(insertResult);
};

const getAllItems = async(req, res) => {
    const findResult = await collection.find({}).toArray();
    res.send(findResult);

}

const updateItems = async (req, res) => {
  const itemId = req.params.id;
  const { name, price, quantity } = req.body;
  const db = client.db(dbName);
  const collection = db.collection('items');

  // Find the existing item to get the old photo filename
  const existingItem = await collection.findOne({ _id: new ObjectId(itemId) });

  let newPhotoFilename = existingItem ? existingItem.photo : null;

  // If a new photo is uploaded, delete the old one and use the new filename
  if (req.file) {
    // Delete old photo if it exists
    if (existingItem && existingItem.photo) {
      const oldPhotoPath = path.join(uploadDir, existingItem.photo);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }
    newPhotoFilename = req.file.filename;
  }

  // Update the item
  const updateResult = await collection.updateOne(
    { _id: new ObjectId(itemId) },
    {
      $set: {
        name,
        price,
        quantity,
        photo: newPhotoFilename,
        updatedAt: new Date(),
      },
    }
  );

  res.send(updateResult);
};

const deleteItems = async(req, res) => {
    const deleteResult = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.send(deleteResult);
}

const getItemsById = async(req, res) => {
    const filteredDocs = await collection.findOne({ _id: new ObjectId(req.params.id)});
    res.send(filteredDocs);


}

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
    saveItems,
    getAllItems,
    updateItems,
    deleteItems,
    getItemsById,
    verifyToken,
    upload
}