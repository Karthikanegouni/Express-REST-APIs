const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketMatchDetails.db");
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000,()=>console.log("Server running at http://localhost:3000"));
  } catch (e) {
    console.error(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

// get players
app.get("/players/", async (req, res) => {
  const query = `SELECT player_id AS playerId, player_name AS playerName FROM player_details;`;
  const result = await db.all(query);
  res.send(result);
});

// get player by id
app.get("/players/:playerId/", async (req, res) => {
  const { playerId } = req.params;
  const query = `SELECT player_id AS playerId, player_name AS playerName FROM player_details WHERE player_id = ?;`;
  const result = await db.get(query, playerId);
  res.send(result);
});

// update player
app.put("/players/:playerId/", async (req, res) => {
  const { playerId } = req.params;
  const { playerName } = req.body;
  const query = `UPDATE player_details SET player_name = ? WHERE player_id = ?;`;
  await db.run(query, playerName, playerId);
  res.send("Player Details Updated");
});

// get match by id
app.get("/matches/:matchId/", async (req, res) => {
  const { matchId } = req.params;
  const query = `SELECT match_id AS matchId, match, year FROM match_details WHERE match_id = ?;`;
  const result = await db.get(query, matchId);
  res.send(result);
});

// get matches of player
app.get("/players/:playerId/matches", async (req, res) => {
  const { playerId } = req.params;
  const query = `
    SELECT 
      match_details.match_id AS matchId,
      match_details.match,
      match_details.year
    FROM match_details
    INNER JOIN player_match_score
    ON match_details.match_id = player_match_score.match_id
    WHERE player_match_score.player_id = ?;`;
  const result = await db.all(query, playerId);
  res.send(result);
});

// get players of match
app.get("/matches/:matchId/players", async (req, res) => {
  const { matchId } = req.params;
  const query = `
    SELECT 
      player_details.player_id AS playerId,
      player_details.player_name AS playerName
    FROM player_details
    INNER JOIN player_match_score
    ON player_details.player_id = player_match_score.player_id
    WHERE player_match_score.match_id = ?;`;
  const result = await db.all(query, matchId);
  res.send(result);
});

// get player stats
app.get("/players/:playerId/playerScores", async (req, res) => {
  const { playerId } = req.params;
  const query = `
    SELECT 
      player_details.player_id AS playerId,
      player_details.player_name AS playerName,
      SUM(score) AS totalScore,
      SUM(fours) AS totalFours,
      SUM(sixes) AS totalSixes
    FROM player_details
    INNER JOIN player_match_score
    ON player_details.player_id = player_match_score.player_id
    WHERE player_details.player_id = ?;`;
  const result = await db.get(query, playerId);
  res.send(result);
});

module.exports = app;
