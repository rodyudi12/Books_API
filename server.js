const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json());
// Books for bookstore API
let books = [
    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        genre: "Fiction",
        copiesAvailable: 5
    },
    {
        id: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        genre: "Fiction",
        copiesAvailable: 3
    },
    {
        id: 3,
        title: "1984",
        author: "George Orwell",
        genre: "Dystopian Fiction",
        copiesAvailable: 7
    }
    // Add more books if you'd like!
];

/* Create your REST API here with the following endpoints:
    'GET /api/books': 'Get all books',
    'GET /api/books/:id': 'Get a specific book',
    'POST /api/books': 'Add a new book',
    'PUT /api/books/:id': 'Update a book',
    'DELETE /api/books/:id': 'Delete a book'
*/

// Part A: GET /api/books - Retrieve all books
app.get('/api/books', (req, res) => {
  res.json(books);
});

// Part B: GET /api/books/:id - Retrieve a specific book by ID
app.get('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id); // Convert ID to number
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  res.json(book);
});
// Add a new book
app.post('/api/books', (req, res) => {
  const { title, author, genre, copiesAvailable } = req.body;

  if (!title || !author || !genre || copiesAvailable === undefined) {
    return res.status(400).json({ error: 'All book fields are required' });
  }

  const newId = books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1;

  const newBook = {
    id: newId,
    title,
    author,
    genre,
    copiesAvailable
  };

  books.push(newBook);
  res.status(201).json(newBook);
});


// Update an existing book
app.put('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);

  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

    const { title, author, genre, copiesAvailable } = req.body;
    if (title) book.title = title;
    if (author) book.author = author;
    if (genre) book.genre = genre;
    if (copiesAvailable !== undefined) book.copiesAvailable = copiesAvailable;

  res.json(book);
});

// Remove a book
app.delete('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const index = books.findIndex(b => b.id === bookId);

  if (index === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const deletedBook = books.splice(index, 1);
  res.json(deletedBook[0]);
});
// Only start server when running directly
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

// Export app for testing
module.exports = app;



