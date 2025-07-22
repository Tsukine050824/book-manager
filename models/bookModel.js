const { getDb } = require('../db');

async function getAllBooks() {
  const db = getDb();
  return db.collection('books').find().toArray();
}

async function getBookByIsbn(isbn) {
  const db = getDb();
  return db.collection('books').findOne({ isbn });
}

async function addBook(book) {
  const db = getDb();
  return db.collection('books').insertOne(book);
}

async function updateBook(isbn, updatedBook) {
  const db = getDb();
  return db.collection('books').updateOne({ isbn }, { $set: updatedBook });
}

async function deleteBook(isbn) {
  const db = getDb();
  return db.collection('books').deleteOne({ isbn });
}




module.exports = {
  getAllBooks,
  getBookByIsbn,
  addBook,
  updateBook,
  deleteBook,
};
