// db.js
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let db;

async function connect() {
  await client.connect();
  db = client.db('book_manager');
  console.log('✅ Connected to MongoDB');
}

function getDb() { // đổi từ getDB sang getDb để thống nhất
  return db;
}

module.exports = { connect, getDb };
