const { MongoClient ,ObjectId } = require('mongodb');

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'super-market';


const db = client.db(dbName);
const collection = db.collection('items');




const saveItems = async(req, res) => {
   const insertResult = await collection.insertOne(req.body);
   res.send(insertResult);


}

const getAllItems = async(req, res) => {
    const findResult = await collection.find({}).toArray();
    res.send(findResult);

}

const updateItems = async(req, res) => {
    const updateResult = await collection.updateOne({ _id: new ObjectId(req.params.id) },{ $set: req.body });
    res.send(updateResult);

}

const deleteItems = async(req, res) => {
    const deleteResult = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.send(deleteResult);
}

const getItemsById = async(req, res) => {
    const filteredDocs = await collection.findOne({ _id: new ObjectId(req.params.id)});
    res.send(filteredDocs);


}

module.exports = {
    saveItems,
    getAllItems,
    updateItems,
    deleteItems,
    getItemsById
}