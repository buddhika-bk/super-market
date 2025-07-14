const { MongoClient ,ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

// JWT Secret Key (should match the one in user-controller.js)
const JWT_SECRET = 'your-secret-key-change-in-production';

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'super-market';


const db = client.db(dbName);
const collection = db.collection('customer');




const saveCustomer = async(req, res) => {
   const insertResult = await collection.insertOne(req.body);
   res.send(insertResult);


}

const getAllCustomer = async(req, res) => {
    const findResult = await collection.find({}).toArray();
    res.send(findResult);

}

const updateCustomer = async(req, res) => {
    const updateResult = await collection.updateOne({ _id: new ObjectId(req.params.id) },{ $set: req.body });
    res.send(updateResult);

}

const deleteCustomer = async(req, res) => {
    const deleteResult = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.send(deleteResult);
}

const getCustomerById = async(req, res) => {
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
  saveCustomer,
  getAllCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerById,
  verifyToken
}