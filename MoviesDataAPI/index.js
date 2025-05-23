const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

let db = null;

const initializeDbAndServer = async function () {
  try {
    const dbPath = path.join(__dirname, "MoviesData.db");
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server Running at http://localhost:3000");
    });
  } catch (e) {
    console.error("DB Initialization Error:", e.message);
    process.exit(1);
  }
};
initializeDbAndServer();

// get all movie names
app.get("/movies/", async (request, response) => {
  try {
    const getMoviesQuery = `SELECT movie_name AS movieName FROM movie;`;
    const dbResponse = await db.all(getMoviesQuery);
    response.status(200).json({ success: true, data: dbResponse });
  } catch (e) {
    console.error("Error fetching movies:", e.message);
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// add a new movie
app.post("/movies/", async (request, response) => {
  try {
    const { directorId, movieName, leadActor } = request.body;
    const addMovieQuery = `
      INSERT INTO movie (director_id, movie_name, lead_actor)
      VALUES (${directorId}, '${movieName}', '${leadActor}');`;
    await db.run(addMovieQuery);
    response
      .status(201)
      .json({ success: true, message: "Movie Successfully Added" });
  } catch (e) {
    console.error("Error adding movie:", e.message);
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// get movie by ID
app.get("/movies/:movieId/", async (request, response) => {
  try {
    const { movieId } = request.params;
    const getMovieQuery = `
      SELECT 
        movie_id AS movieId,
        director_id AS directorId,
        movie_name AS movieName,
        lead_actor AS leadActor
      FROM movie
      WHERE movie_id = ${movieId};`;
    const dbResponse = await db.get(getMovieQuery);
    if (dbResponse) {
      response.status(200).json({ success: true, data: dbResponse });
    } else {
      response.status(404).json({ success: false, message: "Movie Not Found" });
    }
  } catch (e) {
    console.error("Error fetching movie:", e.message);
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// update movie by ID
app.put("/movies/:movieId/", async (request, response) => {
  try {
    const { movieId } = request.params;
    const { directorId, movieName, leadActor } = request.body;
    const updateMovieQuery = `
      UPDATE movie
      SET 
        director_id = ${directorId},
        movie_name = '${movieName}',
        lead_actor = '${leadActor}'
      WHERE movie_id = ${movieId};`;
    const result = await db.run(updateMovieQuery);
    if (result.changes > 0) {
      response
        .status(200)
        .json({ success: true, message: "Movie Details Updated" });
    } else {
      response.status(404).json({ success: false, message: "Movie Not Found" });
    }
  } catch (e) {
    console.error("Error updating movie:", e.message);
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// delete movie by ID
app.delete("/movies/:movieId", async (request, response) => {
  try {
    const { movieId } = request.params;
    const deleteMovieQuery = `DELETE FROM movie WHERE movie_id = ${movieId};`;
    const result = await db.run(deleteMovieQuery);
    if (result.changes > 0) {
      response.status(200).json({ success: true, message: "Movie Removed" });
    } else {
      response.status(404).json({ success: false, message: "Movie Not Found" });
    }
  } catch (e) {
    console.error("Error deleting movie:", e.message);
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// get all directors
app.get("/directors/", async (request, response) => {
  try {
    const getDirectorsQuery = `
      SELECT 
        director_id AS directorId,
        director_name AS directorName
      FROM director;`;
    const dbResponse = await db.all(getDirectorsQuery);
    response.status(200).json({ success: true, data: dbResponse });
  } catch (e) {
    console.error("Error fetching directors:", e.message);
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

// get all movies by director ID
app.get("/directors/:directorId/movies/", async (request, response) => {
  try {
    const { directorId } = request.params;
    const getDirectorMoviesQuery = `
      SELECT 
        movie_name AS movieName 
      FROM movie
      WHERE director_id = ${directorId};`;
    const dbResponse = await db.all(getDirectorMoviesQuery);
    response.status(200).json({ success: true, data: dbResponse });
  } catch (e) {
    console.error("Error fetching movies by director:", e.message);
    response
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = app;
