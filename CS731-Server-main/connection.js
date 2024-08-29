const { MongoClient } = require('mongodb');

// Ensure URI is defined
//var uri = process.env.ATLAS_URI;

var uri = "mongodb+srv://uppal22j:QeVXkKMY4YOmS7Is@cluster0.i0x6ex0.mongodb.net/CS731Phase2?retryWrites=true&w=majority&appName=Cluster0";


// console.log('ATLAS_URI:', uri); // Log to check if URI is available
// if (!uri) {
//      uri = "mongodb+srv://uppal22j:QeVXkKMY4YOmS7Is@cluster0.i0x6ex0.mongodb.net/CS731Phase2?retryWrites=true&w=majority&appName=Cluster0"; 

//     throw new Error("ATLAS_URI is not defined. Please check your .env file.");
// }

const client = new MongoClient(uri);

let db;

const connectToMongoDB = async () => {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        db = client.db('CS731Phase2'); // Explicitly specify the database name
    } catch (err) {
        console.error(err);
    }
};

const getDb = () => {
    if (!db) {
        throw new Error("Database not initialized. Call connectToMongoDB first.");
    }
    return db;
};

module.exports = { connectToMongoDB, getDb };
