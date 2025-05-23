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
    console.error("Error initializing DB/server:", error.message);
    process.exit(1);
  }
};

initializeDbAndServer();

// Get all books
app.get("/books", async (request, response) => {
  try {
    const getQuery = `SELECT * FROM book`;
    const dbResponse = await db.all(getQuery);
    response.status(200).json({ success: true, data: dbResponse });
  } catch (error) {
    console.error("Error fetching books:", error.message);
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// Get a book by ID
app.get("/books/:bookId", async (request, response) => {
  try {
    const { bookId } = request.params;
    const getQuery = `SELECT * FROM book WHERE book_id = ${bookId}`;
    const dbResponse = await db.get(getQuery);
    if (dbResponse) {
      response.status(200).json({ success: true, data: dbResponse });
    } else {
      response.status(404).json({ success: false, message: "Book Not Found" });
    }
  } catch (error) {
    console.error("Error fetching book:", error.message);
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// Add a new book
app.post("/books", async (request, response) => {
  try {
    const { title, author, rating } = request.body;
    const insertQuery = `
      INSERT INTO book (title, author, rating)
      VALUES ('${title}', '${author}', ${rating});`;
    await db.run(insertQuery);
    response
      .status(201)
      .json({ success: true, message: "Book Added Successfully" });
  } catch (error) {
    console.error("Error adding book:", error.message);
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// Update book details
app.put("/books/:bookId", async (request, response) => {
  try {
    const { bookId } = request.params;
    const { title, author, rating } = request.body;
    const updateQuery = `
      UPDATE book
      SET title = '${title}',
          author = '${author}',
          rating = ${rating}
      WHERE book_id = ${bookId};`;
    const result = await db.run(updateQuery);
    if (result.changes > 0) {
      response
        .status(200)
        .json({ success: true, message: "Book Updated Successfully" });
    } else {
      response.status(404).json({ success: false, message: "Book Not Found" });
    }
  } catch (error) {
    console.error("Error updating book:", error.message);
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// Delete a book
app.delete("/books/:bookId", async (request, response) => {
  try {
    const { bookId } = request.params;
    const deleteQuery = `DELETE FROM book WHERE book_id = ${bookId};`;
    const result = await db.run(deleteQuery);
    if (result.changes > 0) {
      response
        .status(200)
        .json({ success: true, message: "Book Deleted Successfully" });
    } else {
      response.status(404).json({ success: false, message: "Book Not Found" });
    }
  } catch (error) {
    console.error("Error deleting book:", error.message);
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});
