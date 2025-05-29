# Todo Application API

## Description

This project is a RESTful API built with Node.js and Express to manage a simple todo list. It allows users to create, retrieve, update, and delete todo items, with support for filtering by status, priority, and category, and querying by due date. The data is stored in an SQLite database.

## Features

* **CRUD Operations:** Create, retrieve, update, and delete todo items.

* **Filtering:** Retrieve todos based on `status`, `priority`, `category`, and `search_q` (search query in todo text).

* **Due Date Query:** Retrieve todos scheduled for a specific date.

* **Data Validation:** Input validation for `status`, `priority`, `category`, and `due_date` to ensure data integrity.

* **SQLite Database:** Uses a local SQLite database for data persistence.

## Technologies Used

* Node.js

* Express.js

* SQLite (via `sqlite` and `sqlite3` packages)

* `date-fns` (for date parsing and formatting)

## Setup

To set up and run this project locally, you need to have Node.js installed.

1.  **Clone the main repository:**
    If you haven't already, clone the main `Express-REST-APIs` repository which contains this project.

    ```
    git clone https://github.com/Karthikanegouni/Express-REST-APIs.git
    
    ```

2.  **Navigate to this project's folder:**
    Change directory into the specific folder containing this Todo Application API code within the cloned repository.

    ```
    cd Express-REST-APIs/Todo's API
    
    ```

3.  **Install dependencies:**

    Run the following command in this project's directory (`Express-REST-APIs/Todo's API/`):

    ```
    npm install express sqlite sqlite3 date-fns
    
    ```

    or if you use yarn:

    ```
    yarn add express sqlite sqlite3 date-fns
    
    ```

4.  **Database Setup:**
    The application uses an SQLite database file named `todoApplication.db`. This file will be automatically created and the `todo` table will be set up when the server starts for the first time.

    The `todo` table schema is:

    ```
    CREATE TABLE IF NOT EXISTS todo (
      id INTEGER PRIMARY KEY,
      todo TEXT,
      category TEXT,
      priority TEXT,
      status TEXT,
      due_date DATE
    );
    
    ```

    You can optionally use a graphical SQLite database browser (like DB Browser for SQLite) to inspect the database or insert sample data manually.

## API Endpoints

The API runs on `http://localhost:3000`.

Here are the available endpoints:

| Method | Endpoint | Description | Query Parameters | Request Body Example (for POST/PUT) |
| :----- | :------- | :---------- | :--------------- | :---------------------------------- |
| `GET` | `/todos/` | Get a list of all todos. Supports filtering by `status`, `priority`, `category`, and `search_q` (search query in todo text). | `status`, `priority`, `category`, `search_q` | None |
| `GET` | `/todos/:id/` | Get details of a specific todo item by its ID. | None | None |
| `GET` | `/agenda/` | Get a list of todos scheduled for a specific `date`. | `date` (format: `YYYY-M-D`, e.g., `2021-1-2`) | None |
| `POST` | `/todos/` | Create a new todo item. | None | `{ "id": 1, "todo": "Buy groceries", "priority": "HIGH", "status": "TO DO", "category": "HOME", "dueDate": "2024-06-15" }` |
| `PUT` | `/todos/:id/` | Update details of an existing todo item by ID. Supports partial updates. | None | `{ "status": "DONE" }` or `{ "priority": "MEDIUM", "dueDate": "2024-07-01" }` |
| `DELETE` | `/todos/:id/` | Delete a todo item by ID. | None | None |

**Validation Rules:**

* **Status:** Must be one of "TO DO", "IN PROGRESS", "DONE".

* **Priority:** Must be one of "HIGH", "MEDIUM", "LOW".

* **Category:** Must be one of "WORK", "HOME", "LEARNING".

* **Due Date:** Must be in `YYYY-M-D` format (e.g., `2021-1-2`). The API will format it to `YYYY-MM-DD` for storage.

## Running the Application

To start the server, navigate to this project's root directory (`Express-REST-APIs/Todo's API/` or equivalent) in your terminal and run:

```bash
node index.js
```
>The server will start and listen on http://localhost:3000. You can then use tools like Postman, Insomnia, or curl to test the API endpoints.