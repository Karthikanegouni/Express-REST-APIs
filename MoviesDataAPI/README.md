# Movie Database API

This project implements a simple RESTful API using Node.js and Express to manage a database of movies and directors. It allows you to perform basic operations like listing movies, adding new movies, updating movie details, deleting movies, listing directors, and finding all movies directed by a specific director. The data is stored in an SQLite database.

## Features

* Get a list of all movie names.
* Add a new movie to the database.
* Retrieve details of a specific movie by its ID.
* Update the details of an existing movie.
* Delete a movie from the database.
* Get a list of all directors.
* Get a list of all movies directed by a specific director.
* Response data keys are formatted from snake_case to camelCase.

## Technologies Used

* Node.js
* Express.js
* SQLite (via `sqlite` and `sqlite3` packages)

## Setup

To set up and run this project locally, you need to have Node.js installed.

1.  **Clone the main repository:**
    If you haven't already, clone the main `ExpressJS` repository where this project resides.
    ```bash
    git clone https://github.com/Karthikanegouni/Express-JS.git
    ```

2.  **Navigate to this project's folder:**
    Change directory into the specific folder containing this Movie Database API code.
    ```bash
    cd Express-JS/MoviesDataAPI/
    ```

3.  **Install dependencies:**

    Run the following command in this project's directory (`Express-JS/moviesDataAPI/`):

    ```bash
    npm install express sqlite sqlite3
    ```
    or if you use yarn:
    ```bash
    yarn add express sqlite sqlite3
    ```

4.  **Database Setup:**
    The application uses an SQLite database file named `moviesData.db`. You need to create this file in the root directory of this specific project folder (`Express-JS/MoviesDataAPI/`).
    Inside `moviesData.db`, you need two tables: `movie` and `director`.

    ```sql
    CREATE TABLE director (
        director_id INTEGER PRIMARY KEY AUTOINCREMENT,
        director_name VARCHAR(255)
    );

    CREATE TABLE movie (
        movie_id INTEGER PRIMARY KEY AUTOINCREMENT,
        director_id INTEGER,
        movie_name VARCHAR(255),
        lead_actor VARCHAR(255),
        FOREIGN KEY (director_id) REFERENCES director(director_id)
    );
    ```
    You can use an SQLite tool to create the database file and these tables. You'll also want to add some sample data to test the API.

## API Endpoints

The API runs on `http://localhost:3000`.

Here are the available endpoints:

| Method | Endpoint                       | Description                                  | Request Body Example (for POST/PUT)                                    |
| :----- | :----------------------------- | :------------------------------------------- | :--------------------------------------------------------------------- |
| `GET`  | `/movies/`                     | Get a list of all movie names.               | None                                                                   |
| `POST` | `/movies/`                     | Add a new movie.                             | `{ "directorId": 1, "movieName": "Example Movie", "leadActor": "Actor Name" }` |
| `GET`  | `/movies/:movieId/`            | Get details of a specific movie by ID.       | None                                                                   |
| `PUT`  | `/movies/:movieId/`            | Update movie details by ID.                  | `{ "directorId": 2, "movieName": "Updated Movie", "leadActor": "New Actor" }` |
| `DELETE`| `/movies/:movieId`             | Delete a movie by ID.                        | None                                                                   |
| `GET`  | `/directors/`                  | Get a list of all directors.                 | None                                                                   |
| `GET`  | `/directors/:directorId/movies/`| Get all movies directed by a specific director.| None                                                                   |

**Note:** API responses will have keys formatted in camelCase (e.g., `movieId`, `directorName`).

## Running the Application

To start the server, navigate to this project's root directory (`Express-JS/MoviesDataAPI/` or equivalent) in your terminal and run:

```bash
node index.js
```

>The server will start and listen on http://localhost:3000. You can then use tools like Postman, Insomnia, or curl to test the API endpoints.