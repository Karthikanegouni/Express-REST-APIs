# Book Management API (Goodreads Clone)

## Description

This project is a simple RESTful API built with Node.js and Express to manage a collection of books. It provides endpoints to perform basic CRUD (Create, Read, Update, Delete) operations on book records stored in an SQLite database. This can serve as a basic backend for a book listing application.

## Features

- Get a list of all books in the collection.
- Retrieve details of a specific book by its ID.
- Add a new book to the collection.
- Update the details of an existing book.
- Delete a book from the collection.

## Technologies Used

- Node.js
- Express.js
- SQLite (via `sqlite` and `sqlite3` packages)

## Setup

To set up and run this project locally, follow these steps:

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Karthikanegouni/Express-JS.git
    cd "Express-JS/goodreads APIs"
    ```

2.  **Install dependencies:**

    Make sure you have Node.js installed. Then, in the project directory, run:

    ```bash
    npm install express sqlite sqlite3
    ```

    or if you use yarn:

    ```bash
    yarn add express sqlite sqlite3
    ```

3.  **Database Setup:**
    The application uses an SQLite database file named `goodreads.db`. You need to create this file in the root directory of the project.
    Inside `goodreads.db`, you need a table named `book` with the following schema:

    ```sql
        CREATE TABLE book (
            book_id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            author_id INTEGER,
            rating REAL,
            rating_count INTEGER,
            review_count INTEGER,
            description TEXT,
            pages INTEGER,
            date_of_publication TEXT,
            edition_language TEXT,
            price INTEGER,
            online_stores TEXT
         );
    ```
        You can use the `sqlite3` command-line tool or a graphical SQLite database browser to create the database file and the `book` table with the specified columns.

## API Endpoints

The API runs on `http://localhost:3000`.

Here are the available endpoints:

| Method   | Endpoint         | Description               | Request Body Example (for POST/PUT)                                                           |
| :------- | :--------------- | :------------------------ | :-------------------------------------------------------------------------------------------- |
| `GET`    | `/books`         | Get all books             | None                                                                                          |
| `GET`    | `/books/:bookId` | Get a book by ID          | None                                                                                          |
| `POST`   | `/books`         | Add a new book            | `{ "title": "The Hitchhiker's Guide to the Galaxy", "author": "Douglas Adams", "rating": 5 }` |
| `PUT`    | `/books/:bookId` | Update book details by ID | `{ "title": "Updated Title", "author": "Updated Author", "rating": 4 }`                       |
| `DELETE` | `/books/:bookId` | Delete a book by ID       | None                                                                                          |

## Running the Application

To start the server, navigate to the project's root directory in your terminal and run:

```bash
node index.js
```

> The server will start and listen on http://localhost:3000. You can then use tools like Postman, Insomnia, or curl to test the API endpoints.
