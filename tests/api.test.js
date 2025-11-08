const request = require('supertest');
const app = require('../server'); // Import your Express app

describe('Books API', () => {
  let newBookId;

  // Test GET /api/books
  test('should return all books', async () => {
    const response = await request(app).get('/api/books');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0); // should return at least 1 book
  });

  // Test GET /api/books/:id with valid ID
  test('should return a book by valid ID', async () => {
    const response = await request(app).get('/api/books/1');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('title');
    expect(response.body).toHaveProperty('author');
  });

  // Test GET /api/books/:id with invalid ID
  test('should return 404 for invalid book ID', async () => {
    const response = await request(app).get('/api/books/999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Book not found');
  });

  // Test POST /api/books
  test('should create a new book (Harry Potter)', async () => {
    const newBook = {
      title: "Harry Potter",
      author: "J. K. Rowling",
      genre: "Adventure Fantasy",
      copiesAvailable: 8
    };

    const response = await request(app)
      .post('/api/books')
      .send(newBook);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe('Harry Potter');

    newBookId = response.body.id; // save ID for later PUT/DELETE tests
  });

  // Test PUT /api/books/:id
  test('should update an existing book (Harry Potter)', async () => {
    const updatedBook = {
      title: "Harry Potter and the Sorcerer’s Stone",
      copiesAvailable: 10
    };

    const response = await request(app)
      .put(`/api/books/${newBookId}`)
      .send(updatedBook);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe(updatedBook.title);
    expect(response.body.copiesAvailable).toBe(updatedBook.copiesAvailable);
  });

  // Test PUT /api/books/:id with invalid ID
  test('should return 404 when updating non-existent book', async () => {
    const response = await request(app)
      .put('/api/books/999')
      .send({ title: 'Invalid' });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Book not found');
  });

  // Test DELETE /api/books/:id
  test('should delete the Harry Potter book', async () => {
    const response = await request(app).delete(`/api/books/${newBookId}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(newBookId);
  });

  // Test DELETE /api/books/:id with invalid ID
  test('should return 404 when deleting non-existent book', async () => {
    const response = await request(app).delete('/api/books/999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Book not found');
  });
});
