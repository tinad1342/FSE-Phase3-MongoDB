const MongoClient = require('mongodb').MongoClient;
const dbName = 'custdb';
const baseUrl = "mongodb://127.0.0.1:27017";
const collectionName = "customers"
const connectString = baseUrl + "/" + dbName; 
let collection;

async function dbStartup() {
    const client = new MongoClient(connectString);
    await client.connect();
    collection = client.db(dbName).collection(collectionName);
}

async function getCustomers() {
    try {
        const customerData = await collection.find().toArray();
        return [customerData, null];
    } 
    catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}

async function resetCustomers() {
    const initialCustomers = [
        { "_id": "66280ff1e0d3d5f5549f990a", "id": "0", "name": "Mary Jackson", "email": "maryj@abc.com" },
        { "_id": "6628103ce0d3d5f5549f990b", "id": "1", "name": "Karen Addams", "email": "karena@abc.com" },
        { "_id": "6628105be0d3d5f5549f990c", "id": "2", "name": "Scott Ramsey", "email": "scottr@abc.com" }
    ]; 

    try {
        await collection.deleteMany({});
        await collection.insertMany(initialCustomers);
        const dbCount = await collection.count();
        const message = "There are now " + dbCount + "customer records!"
        return [message, null];
    } catch (err) {
        console.log(err.message);
        return [null, err.message];
    }
}

async function addCustomer(newCustomer) {
    try {
        const result = await collection.insertOne(newCustomer);
        return ["success", result.insertedId, null];
    } 
    catch (err) {
        console.log(err.message);
        return ["fail", null, err.message];
    }
}

dbStartup();
module.exports = { getCustomers, resetCustomers, addCustomer };