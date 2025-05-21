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
    console.log(e.message);
    process.exit(1);
  }
};
initializeDbAndServer();

// get all players
app.get("/players/", async (request, response) => {
  const getQuery = `
    SELECT 
      player_id AS playerId,
      player_name AS playerName,
      jersey_number AS jerseyNumber,
      role
    FROM cricket_team;`;
  const dbResponse = await db.all(getQuery);
  response.send(dbResponse);
});

// add a player
app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const postQuery = `
    INSERT INTO cricket_team (player_name, jersey_number, role)
    VALUES ('${playerName}', ${jerseyNumber}, '${role}');`;
  await db.run(postQuery);
  response.send("Player Added to Team");
});

// get player by ID
app.get("/players/:playerId/", async (request, response) => {
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
  response.send(dbResponse);
});

// update player by ID
app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const updateQuery = `
    UPDATE cricket_team
    SET 
      player_name = '${playerName}',
      jersey_number = ${jerseyNumber},
      role = '${role}'
    WHERE player_id = ${playerId};`;
  await db.run(updateQuery);
  response.send("Player Details Updated");
});

// delete player by ID
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `
    DELETE FROM cricket_team
    WHERE player_id = ${playerId};`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;
