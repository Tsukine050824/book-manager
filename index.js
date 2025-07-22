// index.js
const express = require('express');
const { connect } = require('./db');
const logger = require('./middlewares/logger');
const contentTypeCheck = require('./middlewares/contentTypeCheck');
const bookModel = require('./models/bookModel');

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const port = 3000;

app.use(express.json());
app.use(logger);
app.use(contentTypeCheck);

// Swagger setup
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Library Book Manager API',
    version: '1.0.0',
    description: 'CRUD Book API with Express, MongoDB, Swagger',
  },
  servers: [{ url: `http://localhost:${port}` }],
};

const options = {
  swaggerDefinition,
  apis: ['./index.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books
 *     responses:
 *       200:
 *         description: List of books
 */
app.get('/books', async (req, res) => {
  const books = await bookModel.getAllBooks();
  res.json(books);
});

/**
 * @swagger
 * /books/{isbn}:
 *   get:
 *     summary: Get a book by ISBN
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book found
 *       404:
 *         description: Book not found
 */
app.get('/books/:isbn', async (req, res) => {
  const book = await bookModel.getBookByIsbn(req.params.isbn);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Add a new book
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isbn, title, author, year, category]
 *             properties:
 *               isbn:
 *                 type: string
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               year:
 *                 type: integer
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book added
 *       400:
 *         description: Invalid input or ISBN exists
 */
app.post('/books', async (req, res) => {
  const book = req.body;
  if (!book.isbn || !book.title || !book.author || !book.category || !Number.isInteger(book.year) || book.year < 1900) {
    return res.status(400).json({ message: 'Invalid book data' });
  }
  const exists = await bookModel.getBookByIsbn(book.isbn);
  if (exists) return res.status(400).json({ message: 'ISBN already exists' });

  await bookModel.addBook(book);
  res.status(201).json({ message: 'Book added', book });
});

/**
 * @swagger
 * /books/{isbn}:
 *   put:
 *     summary: Update a book by ISBN
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isbn, title, author, year, category]
 *             properties:
 *               isbn:
 *                 type: string
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               year:
 *                 type: integer
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book updated
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Book not found
 */
app.put('/books/:isbn', async (req, res) => {
  const updatedBook = req.body;
  if (!updatedBook.isbn || !updatedBook.title || !updatedBook.author || !updatedBook.category || !Number.isInteger(updatedBook.year) || updatedBook.year < 1900) {
    return res.status(400).json({ message: 'Invalid book data' });
  }
  const result = await bookModel.updateBook(req.params.isbn, updatedBook);
  if (result.matchedCount === 0) return res.status(404).json({ message: 'Book not found' });
  res.json({ message: 'Book updated' });
});

/**
 * @swagger
 * /books/{isbn}:
 *   delete:
 *     summary: Delete a book by ISBN
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted
 *       404:
 *         description: Book not found
 */
app.delete('/books/:isbn', async (req, res) => {
  const result = await bookModel.deleteBook(req.params.isbn);
  if (result.deletedCount === 0) return res.status(404).json({ message: 'Book not found' });
  res.json({ message: 'Book deleted' });
});


// Start server
connect().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
}).catch(err => {
  console.error('❌ Failed to connect to MongoDB', err);
});
