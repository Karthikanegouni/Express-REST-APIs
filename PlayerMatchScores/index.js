//Player Match Scores REST APIs
const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const app = express();
app.use(express.json()); //uses JSON format
let db = null;
const initializeDbAndServer = async () => {
  try {
    const dbPath = path.join(__dirname, "cricketMatchDetails.db");
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server running at http:localhost:3000/")
    );
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};
initializeDbAndServer();

//API 1 (Returns a list of all the players in the player table)
app.get("/players/", async (request, response) => {
  try {
    const getPlayersQuery = `
            SELECT 
                player_id AS playerId,
                player_name AS playerName
            FROM 
            player_details;`;
    const dbResponse = await db.all(getPlayersQuery);
    response.send(dbResponse);
  } catch (e) {
    response.send(e.message);
  }
});

//API 2 (Returns a specific player based on the player ID)
app.get("/players/:playerId/", async (request, response) => {
  try {
    const { playerId } = request.params;
    const getPlayerQuery = `
            SELECT 
                player_id AS playerId,
                player_name AS playerName
            FROM
                player_details
            WHERE
                player_id = ?;`;
    const dbResponse = await db.get(getPlayerQuery, [playerId]);
    response.send(dbResponse);
  } catch (e) {
    response.send(e.message);
  }
});

//API 3 (Updates the details of a specific player based on the player ID)
app.put("/players/:playerId/", async (request, response) => {
  try {
    const { playerId } = request.params;
    const { playerName } = request.body;
    const updatePlayerDetailsQuery = `
            UPDATE
                player_details
            SET
                player_name = ?
            WHERE
                player_id = ?;`;
    const dbResponse = await db.run(updatePlayerDetailsQuery, [
      playerName,
      playerId,
    ]);
    response.send("Player Details Updated");
  } catch (e) {
    response.send(e.message);
  }
});

//API 4 (Returns the match details of a specific match)
app.get("/matches/:matchId", async (request, response) => {
  try {
    const { matchId } = request.params;
    const getMatchDetailsQuery = `
            SELECT
                match_id AS matchId,
                match,
                year
            FROM
                match_details
            WHERE
                match_id = ?;`;
    const dbResponse = await db.get(getMatchDetailsQuery, [matchId]);
    response.send(dbResponse);
  } catch (e) {
    response.send(e.message);
  }
});

//API 5 (Returns a list of all the matches of a player)
app.get("/players/:playerId/matches", async (request, response) => {
  try {
    const { playerId } = request.params;
    const getMatchesOfPlayer = `
                SELECT
                    md.match_id AS matchId,
                    md.match,
                    md.year
                FROM
                    match_details md
                INNER JOIN 
                    player_match_score pms
                ON
                    md.match_id = pms.match_id
                WHERE
                    pms.player_id = ?;`;
    const dbResponse = await db.all(getMatchesOfPlayer, [playerId]);
    response.send(dbResponse);
  } catch (e) {
    response.send(e.message);
  }
});

//API 6 (Returns a list of players of a specific match)
app.get("/matches/:matchId/players/", async (request, response) => {
  try {
    const { matchId } = request.params;
    const getPlayersOfMacthQuery = `
            SELECT
                pd.player_id AS playerId,
                pd.player_name AS playerName
            FROM
                player_details pd
            INNER JOIN
                player_match_score pms
            ON
                pd.player_id = pms.player_id
            WHERE
                pms.match_id = ?;`;
    const dbResponse = await db.all(getPlayersOfMacthQuery, [matchId]);
    response.send(dbResponse);
  } catch (e) {
    response.send(e.message);
  }
});

//API 7 (Returns the statistics of the total score, fours, sixes of a specific player based on the player ID)
app.get("/players/:playerId/playerScores/", async (request, response) => {
  try {
    const { playerId } = request.params;
    const getPlayerStats = `
            SELECT
                pd.player_id AS playerId,
                pd.player_name AS playerName,
                sum(score) AS totalScore,
                sum(fours) AS totalFours,
                sum(sixes) AS totalSixes
            FROM 
                player_match_score pms
            INNER JOIN
                player_details pd 
            ON
                pms.player_id = pd.player_id
            WHERE
                pms.player_id = ?;`;
    const dbResponse = await db.get(getPlayerStats, [playerId]);
    response.send(dbResponse);
  } catch (e) {
    response.send(e.message);
  }
});

module.exports = app;
