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
    console.log(e.message);
    process.exit(1);
  }
};
initializeDbAndServer();

// get all movie names
app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `SELECT movie_name AS movieName FROM movie;`;
  const dbResponse = await db.all(getMoviesQuery);
  response.send(dbResponse);
});

// add a new movie
app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const addMovieQuery = `
    INSERT INTO movie (director_id, movie_name, lead_actor)
    VALUES (${directorId}, '${movieName}', '${leadActor}');`;
  await db.run(addMovieQuery);
  response.send("Movie Successfully Added");
});

// get movie by ID
app.get("/movies/:movieId/", async (request, response) => {
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
  response.send(dbResponse);
});

// update movie by ID
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const updateMovieQuery = `
    UPDATE movie
    SET 
      director_id = ${directorId},
      movie_name = '${movieName}',
      lead_actor = '${leadActor}'
    WHERE movie_id = ${movieId};`;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

// delete movie by ID
app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `DELETE FROM movie WHERE movie_id = ${movieId};`;
  await db.run(deleteMovieQuery);
  response.send("Movie Removed");
});

// get all directors
app.get("/directors/", async (request, response) => {
  const getDirectorsQuery = `
    SELECT 
      director_id AS directorId,
      director_name AS directorName
    FROM director;`;
  const dbResponse = await db.all(getDirectorsQuery);
  response.send(dbResponse);
});

// get all movies by director ID
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorMoviesQuery = `
    SELECT 
      movie_name AS movieName 
    FROM movie
    WHERE director_id = ${directorId};`;
  const dbResponse = await db.all(getDirectorMoviesQuery);
  response.send(dbResponse);
});

module.exports = app;
