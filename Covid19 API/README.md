# COVID-19 India Data API

## Description

This project is a RESTful API built with Node.js and Express to manage COVID-19 data for states and districts in India. It provides endpoints to retrieve state and district information, add new districts, update district details, delete districts, get state-wise statistics, and find the state name for a given district. The data is stored in an SQLite database.

## Features

* Get a list of all states with their IDs, names, and population.
* Get details of a specific state by ID.
* Add a new district with its name, state ID, and case statistics (cases, cured, active, deaths).
* Get details of a specific district by ID.
* Delete a district by ID.
* Update the details of an existing district by ID.
* Get aggregated statistics (total cases, cured, active, deaths) for a specific state.
* Get the state name for a given district ID.
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
    Change directory into the specific folder containing this COVID-19 India Data API code within the cloned repository.
    ```bash
    cd Express-JS/Covid19 API/
    ```

3.  **Install dependencies:**

    Run the following command in this project's directory (`Express-JS/Covid19 API/`):

    ```bash
    npm install express sqlite sqlite3
    ```
    or if you use yarn:
    ```bash
    yarn add express sqlite sqlite3
    ```

4.  **Database Setup:**
    The application uses an SQLite database file named `covid19India.db`. You need to create this file in the root directory of this specific project folder (`Express-JS/Covid19 API/`).
    Inside `covid19India.db`, you need the following tables: `state` and `district`. 

    ```sql
    CREATE TABLE state (
        state_id INTEGER PRIMARY KEY AUTOINCREMENT,
        state_name VARCHAR(255),
        population INTEGER
    );

    CREATE TABLE district (
        district_id INTEGER PRIMARY KEY AUTOINCREMENT,
        district_name VARCHAR(255),
        state_id INTEGER,
        cases INTEGER,
        cured INTEGER,
        active INTEGER,
        deaths INTEGER,
        FOREIGN KEY (state_id) REFERENCES state(state_id)
    );
    ```
    You can use the `sqlite3` command-line tool to create the database file and these tables. You'll also need to insert some sample data into these tables to test the API endpoints.

## API Endpoints

The API runs on `http://localhost:3000`.

Here are the available endpoints:

| Method | Endpoint                         | Description                                                 | Request Body Example (for POST/PUT)                                                              |
| :----- | :------------------------------- | :---------------------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| `GET`  | `/states/`                       | Get a list of all states.                                   | None                                                                                             |
| `GET`  | `/states/:stateId/`              | Get details of a specific state by ID.                      | None                                                                                             |
| `POST` | `/districts/`                    | Create a new district.                                      | `{ "districtName": "Kadapa", "stateId": 3, "cases": 200, "cured": 150, "active": 30, "deaths": 20 }` |
| `GET`  | `/districts/:districtId/`        | Get details of a specific district by ID.                   | None                                                                                             |
| `DELETE`| `/districts/:districtId/`        | Delete a district by ID.                                    | None                                                                                             |
| `PUT`  | `/districts/:districtId/`        | Update district details by ID.                              | `{ "districtName": "YSR Kadapa", "stateId": 3, "cases": 250, "cured": 200, "active": 40, "deaths": 10 }` |
| `GET`  | `/states/:stateId/stats/`        | Get aggregated stats (total cases, cured, active, deaths) for a state. | None                                                                                             |
| `GET`  | `/districts/:districtId/details/`| Get the state name for a given district ID.                 | None                                                                                             |

**Note:** API responses will have keys formatted in camelCase (e.g., `stateId`, `stateName`, `districtId`, `totalCases`, `totalCured`, `totalActive`, `totalDeaths`).

## Running the Application

To start the server, navigate to this project's root directory (`Express-JS/Covid19 API/` or equivalent) in your terminal and run:

```bash
node index.js
```
>The server will start and listen on http://localhost:3000. You can then use tools like Postman, Insomnia, or curl to test the API endpoints.
