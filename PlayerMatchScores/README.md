# Cricket Match Details API

## Description

This project implements a simple RESTful API using Node.js and Express to manage a database of cricket match details, including players, matches, and player scores within those matches. It provides endpoints to retrieve information about players and matches, update player details, list matches for a player, list players in a match, and get a player's overall match stats. The data is stored in an SQLite database.

## Features

* Get a list of all players (ID and Name).
* Get details of a specific player by ID (ID and Name).
* Update the name of a player.
* Get details of a specific match by ID (ID, Match Name, and Year).
* Get a list of all matches played by a specific player.
* Get a list of all players who participated in a specific match.
* Get combined statistics (total score, total fours, total sixes) for a specific player across all their matches.
* Response data keys are formatted from snake_case to camelCase.

## Technologies Used

* Node.js
* Express.js
* SQLite (via `sqlite` and `sqlite3` packages)

## Setup

To set up and run this project locally, you need to have Node.js installed.

1.  **Clone the main repository:**
    If you haven't already, clone the main `Express-JS` repository which contains this project.
    ```bash
    git clone https://github.com/Karthikanegouni/Express-JS.git
    ```

2.  **Navigate to this project's folder:**
    Change directory into the specific folder containing this Cricket Match Details API code within the cloned repository.
    ```bash
    cd Express-JS/PlayerMatchScores/
    ```

3.  **Install dependencies:**

    Run the following command in this project's directory (`Express-JS/PlayerMatchScores/`):

    ```bash
    npm install express sqlite sqlite3
    ```
    or if you use yarn:
    ```bash
    yarn add express sqlite sqlite3
    ```

4.  **Database Setup:**
    The application uses an SQLite database file named `cricketMatchDetails.db`. You need to create this file in the root directory of this specific project folder (`Express-JS/PlayerMatchScores/`).
    Inside `cricketMatchDetails.db`, you need the following tables: `player_details`, `match_details`, and `player_match_score`.

    ```sql
    CREATE TABLE player_details (
        player_id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_name VARCHAR(255)
    );

    CREATE TABLE match_details (
        match_id INTEGER PRIMARY KEY AUTOINCREMENT,
        match VARCHAR(255),
        year INTEGER
    );

    CREATE TABLE player_match_score (
        player_match_score_id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id INTEGER,
        match_id INTEGER,
        score INTEGER,
        fours INTEGER,
        sixes INTEGER,
        FOREIGN KEY (player_id) REFERENCES player_details(player_id),
        FOREIGN KEY (match_id) REFERENCES match_details(match_id)
    );
    ```
    You can use the `sqlite3` command-line tool to create the database file and these tables. You'll also need to insert some sample data into these tables to test the API endpoints.

## API Endpoints

The API runs on `http://localhost:3000`.

Here are the available endpoints:

| Method | Endpoint                             | Description                                               | Request Body Example (for PUT)               |
| :----- | :----------------------------------- | :-------------------------------------------------------- | :------------------------------------------- |
| `GET`  | `/players/`                          | Get a list of all players.                                | None                                         |
| `GET`  | `/players/:playerId/`                | Get details of a specific player by ID.                   | None                                         |
| `PUT`  | `/players/:playerId/`                | Update a player's name by ID.                             | `{ "playerName": "Updated Player Name" }`    |
| `GET`  | `/matches/:matchId/`                 | Get details of a specific match by ID.                    | None                                         |
| `GET`  | `/players/:playerId/matches`         | Get all matches played by a specific player.              | None                                         |
| `GET`  | `/matches/:matchId/players`          | Get all players in a specific match.                      | None                                         |
| `GET`  | `/players/:playerId/playerScores`    | Get combined stats (score, fours, sixes) for a player.    | None                                         |

**Note:** API responses will have keys formatted in camelCase (e.g., `playerId`, `playerName`, `matchId`, `totalScore`, `totalFours`, `totalSixes`).

## Running the Application

To start the server, navigate to this project's root directory (`Express-JS/cricketMatchApi/` or equivalent) in your terminal and run:

```bash
node index.js
```
>The server will start and listen on http://localhost:3000. You can then use tools like Postman, Insomnia, or curl to test the API endpoints.