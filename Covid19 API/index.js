const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "covid19India.db");
let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () =>
      console.log("server running at http://localhost:3000")
    );
  } catch (error) {
    console.error(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

/*
API 1: Get all states
GET /states/
*/
app.get("/states/", async (req, res) => {
  try {
    const query = `SELECT state_id AS stateId, state_name AS stateName, population FROM state;`;
    const result = await db.all(query);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
API 2: Get state by ID
GET /states/:stateId/
*/
app.get("/states/:stateId/", async (req, res) => {
  try {
    const { stateId } = req.params;
    const query = `SELECT state_id AS stateId, state_name AS stateName, population FROM state WHERE state_id = ?;`;
    const result = await db.get(query, stateId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
API 3: Create new district
POST /districts/
*/
app.post("/districts/", async (req, res) => {
  try {
    const { districtName, stateId, cases, cured, active, deaths } = req.body;
    const query = `
    INSERT INTO district (district_name, state_id, cases, cured, active, deaths)
    VALUES (?, ?, ?, ?, ?, ?);`;
    await db.run(query, districtName, stateId, cases, cured, active, deaths);
    res
      .status(200)
      .json({ success: true, data: "District Successfully Added" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
API 4: Get district by ID
GET /districts/:districtId/
*/
app.get("/districts/:districtId/", async (req, res) => {
  try {
    const { districtId } = req.params;
    const query = `
    SELECT district_id AS districtId, district_name AS districtName, state_id AS stateId,
           cases, cured, active, deaths
    FROM district
    WHERE district_id = ?;`;
    const result = await db.get(query, districtId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
API 5: Delete district
DELETE /districts/:districtId/
*/
app.delete("/districts/:districtId/", async (req, res) => {
  try {
    const { districtId } = req.params;
    const query = `DELETE FROM district WHERE district_id = ?;`;
    await db.run(query, districtId);
    res.status(200).json({ success: true, data: "District Removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
API 6: Update district by ID
PUT /districts/:districtId/
*/
app.put("/districts/:districtId/", async (req, res) => {
  try {
    const { districtId } = req.params;
    const { districtName, stateId, cases, cured, active, deaths } = req.body;
    const query = `
    UPDATE district
    SET 
      district_name = ?, 
      state_id = ?, 
      cases = ?, 
      cured = ?, 
      active = ?, 
      deaths = ?
    WHERE district_id = ?;`;
    await db.run(
      query,
      districtName,
      stateId,
      cases,
      cured,
      active,
      deaths,
      districtId
    );
    res.status(200).json({ success: true, data: "District Details Updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
API 7: Get state stats by ID
GET /states/:stateId/stats/
*/
app.get("/states/:stateId/stats/", async (req, res) => {
  try {
    const { stateId } = req.params;
    const query = `
    SELECT 
      SUM(cases) AS totalCases,
      SUM(cured) AS totalCured,
      SUM(active) AS totalActive,
      SUM(deaths) AS totalDeaths
    FROM district
    WHERE state_id = ?;`;
    const result = await db.get(query, stateId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/*
API 8: Get state name of a district
GET /districts/:districtId/details/
*/
app.get("/districts/:districtId/details/", async (req, res) => {
  try {
    const { districtId } = req.params;
    const query = `
    SELECT state.state_name AS stateName
    FROM district
    JOIN state ON district.state_id = state.state_id
    WHERE district.district_id = ?;`;
    const result = await db.get(query, districtId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
