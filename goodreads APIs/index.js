const express = require("express");
const app = express();
app.use(express.json());

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

let db = null;

const initializeDbAndServer = async () => {
  try {
    let dbPath = path.join(__dirname, "goodreads.db");
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  } catch (error) {
    console.log(error.message);
  }
};

initializeDbAndServer();

// Get all books
app.get("/books", async (request, response) => {
  const getQuery = `SELECT * FROM book`;
  let dbResponse = await db.all(getQuery);
  response.send(dbResponse);
});

// Get a book by ID
app.get("/books/:bookId", async (request, response) => {
  const { bookId } = request.params;
  const getQuery = `SELECT * FROM book WHERE book_id = ${bookId}`;
  let dbResponse = await db.get(getQuery);
  response.send(dbResponse);
});

// Add a new book
app.post("/books", async (request, response) => {
  const { title, author, rating } = request.body;
  const insertQuery = `
    INSERT INTO book (title, author, rating)
    VALUES ('${title}', '${author}', ${rating});`;
  await db.run(insertQuery);
  response.send("Book Added Successfully");
});

// Update book details
app.put("/books/:bookId", async (request, response) => {
  const { bookId } = request.params;
  const { title, author, rating } = request.body;
  const updateQuery = `
    UPDATE book
    SET title = '${title}',
        author = '${author}',
        rating = ${rating}
    WHERE book_id = ${bookId};`;
  await db.run(updateQuery);
  response.send("Book Updated Successfully");
});

// Delete a book
app.delete("/books/:bookId", async (request, response) => {
  const { bookId } = request.params;
  const deleteQuery = `DELETE FROM book WHERE book_id = ${bookId};`;
  await db.run(deleteQuery);
  response.send("Book Deleted Successfully");
});
