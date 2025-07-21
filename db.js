// db.js
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // chỉnh nếu MongoDB của bạn có URI khác
const client = new MongoClient(uri);

let db;

async function connect() {
  await client.connect();
  db = client.db('book_manager'); // tên DB của bạn
  console.log('✅ Connected to MongoDB');
}

function getDB() {
  return db;
}

module.exports = { connect, getDB };
