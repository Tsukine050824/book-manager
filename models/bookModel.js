// models/bookModel.js
const { getDB } = require('../db');
const collectionName = 'books';

async function getAllBooks() {
  const db = getDB();
  return db.collection(collectionName).find().toArray();
}

async function getBookByIsbn(isbn) {
  const db = getDB();
  return db.collection(collectionName).findOne({ isbn });
}

async function addBook(book) {
  const db = getDB();
  return db.collection(collectionName).insertOne(book);
}

async function updateBook(isbn, updatedBook) {
  const db = getDB();
  return db.collection(collectionName).updateOne({ isbn }, { $set: updatedBook });
}

async function deleteBook(isbn) {
  const db = getDB();
  return db.collection(collectionName).deleteOne({ isbn });
}

module.exports = {
  getAllBooks,
  getBookByIsbn,
  addBook,
  updateBook,
  deleteBook,
};

