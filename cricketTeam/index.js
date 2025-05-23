const express = require("express");
const app = express();
app.use(express.json());
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

let db = null;

const initializeDbAndServer = async () => {
  try {
    const dbPath = path.join(__dirname, "cricketTeam.db");
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000");
    });
  } catch (e) {
    console.error("Error initializing the database and server:", e.message);
    process.exit(1);
  }
};
initializeDbAndServer();

// get all players
app.get("/players/", async (request, response) => {
  try {
    const getQuery = `
      SELECT 
        player_id AS playerId,
        player_name AS playerName,
        jersey_number AS jerseyNumber,
        role
      FROM cricket_team;`;
    const dbResponse = await db.all(getQuery);
    response.status(200).json({ success: true, data: dbResponse });
  } catch (e) {
    console.error("Error fetching players:", e.message);
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// add a player
app.post("/players/", async (request, response) => {
  try {
    const { playerName, jerseyNumber, role } = request.body;
    const postQuery = `
      INSERT INTO cricket_team (player_name, jersey_number, role)
      VALUES ('${playerName}', ${jerseyNumber}, '${role}');`;
    await db.run(postQuery);
    response
      .status(201)
      .json({ success: true, message: "Player Added to Team" });
  } catch (e) {
    console.error("Error adding player:", e.message);
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// get player by ID
app.get("/players/:playerId/", async (request, response) => {
  try {
    const { playerId } = request.params;
    const getQuery = `
      SELECT 
        player_id AS playerId,
        player_name AS playerName,
        jersey_number AS jerseyNumber,
        role
      FROM cricket_team
      WHERE player_id = ${playerId};`;
    const dbResponse = await db.get(getQuery);
    if (dbResponse) {
      response.status(200).json({ success: true, data: dbResponse });
    } else {
      response
        .status(404)
        .json({ success: false, message: "Player Not Found" });
    }
  } catch (e) {
    console.error("Error fetching player by ID:", e.message);
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// update player by ID
app.put("/players/:playerId", async (request, response) => {
  try {
    const { playerId } = request.params;
    const { playerName, jerseyNumber, role } = request.body;
    const updateQuery = `
      UPDATE cricket_team
      SET 
        player_name = '${playerName}',
        jersey_number = ${jerseyNumber},
        role = '${role}'
      WHERE player_id = ${playerId};`;
    const result = await db.run(updateQuery);
    if (result.changes > 0) {
      response
        .status(200)
        .json({ success: true, message: "Player Details Updated" });
    } else {
      response
        .status(404)
        .json({ success: false, message: "Player Not Found" });
    }
  } catch (e) {
    console.error("Error updating player:", e.message);
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// delete player by ID
app.delete("/players/:playerId/", async (request, response) => {
  try {
    const { playerId } = request.params;
    const deleteQuery = `
      DELETE FROM cricket_team
      WHERE player_id = ${playerId};`;
    const result = await db.run(deleteQuery);
    if (result.changes > 0) {
      response.status(200).json({ success: true, message: "Player Removed" });
    } else {
      response
        .status(404)
        .json({ success: false, message: "Player Not Found" });
    }
  } catch (e) {
    console.error("Error deleting player:", e.message);
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = app;
