# Cricket Team Management API

## Description

This project is a simple RESTful API built with Node.js and Express to manage a cricket team's players. It allows you to perform basic CRUD (Create, Read, Update, Delete) operations on player records stored in an SQLite database.

## Features

* Get a list of all players.
* Add a new player to the team.
* Get details of a specific player by ID.
* Update the details of an existing player.
* Delete a player from the team.

## Technologies Used

* Node.js
* Express.js
* SQLite (via `sqlite` and `sqlite3` packages)

## Setup

To run this project locally, you need to have Node.js installed.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Karthikanegouni/Express-JS.git
    cd Express-JS/cricketTeam
    ```

2.  **Install dependencies:**

    ```bash
    npm install express sqlite sqlite3
    ```
    or if you use yarn:
    ```bash
    yarn add express sqlite sqlite3
    ```

3.  **Database Setup:**
    This application uses an SQLite database named `cricketTeam.db`. You need to create this file in the root directory of the project.
    Inside `cricketTeam.db`, you need a table named `cricket_team` with the following schema:

    ```sql
    CREATE TABLE cricket_team (
      player_id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_name VARCHAR(100),
      jersey_number INTEGER,
      role VARCHAR(100)
    );
    ```
    You can use a tool like `sqlite3` command-line interface or a GUI tool to create the database file and the table.

## API Endpoints

The API runs on `http://localhost:3000`.

Here are the available endpoints:

| Method | Endpoint           | Description                   | Request Body Example (for POST/PUT)                   |
| :----- | :----------------- | :---------------------------- | :---------------------------------------------------- |
| `GET`  | `/players/`        | Get all players               | None                                                  |
| `POST` | `/players/`        | Add a new player              | `{ "playerName": "John Doe", "jerseyNumber": 10, "role": "Batsman" }` |
| `GET`  | `/players/:playerId/` | Get a player by ID            | None                                                  |
| `PUT`  | `/players/:playerId` | Update a player by ID         | `{ "playerName": "Jane Smith", "jerseyNumber": 11, "role": "Bowler" }` |
| `DELETE`| `/players/:playerId/`| Delete a player by ID         | None                                                  |

**Note:** The `formatResponse` function in the code converts the snake_case database column names to camelCase in the API responses.

## Running the Application

To start the server, run the following command in your project's root directory:

```bash
node index.js
```
>The server will start and listen on http://localhost:3000. You can then use tools like Postman, Insomnia, or curl to test the API endpoints.