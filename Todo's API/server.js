const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const { format, isValid, parse } = require("date-fns");

const app = express();
app.use(express.json());

const dbPath = "todoApplication.db";
let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    await db.run(`
      CREATE TABLE IF NOT EXISTS todo (
        id INTEGER PRIMARY KEY,
        todo TEXT,
        category TEXT,
        priority TEXT,
        status TEXT,
        due_date DATE
      )
    `);

    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000/");
    });
  } catch (e) {
    console.error(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// Validation
const isValidStatus = (status) => ["TO DO", "IN PROGRESS", "DONE"].includes(status);
const isValidPriority = (priority) => ["HIGH", "MEDIUM", "LOW"].includes(priority);
const isValidCategory = (category) => ["WORK", "HOME", "LEARNING"].includes(category);

// Format date like 2021-1-2 => 2021-01-02
const formatDate = (dateString) => {
  try {
    const parsedDate = parse(dateString, "yyyy-M-d", new Date());
    if (!isValid(parsedDate)) return null;
    return format(parsedDate, "yyyy-MM-dd");
  } catch {
    return null;
  }
};

// GET Todos with filters
app.get("/todos/", async (req, res) => {
  try {
    const { status, priority, category, search_q = "" } = req.query;

    if (status && !isValidStatus(status)) return res.status(400).send("Invalid Todo Status");
    if (priority && !isValidPriority(priority)) return res.status(400).send("Invalid Todo Priority");
    if (category && !isValidCategory(category)) return res.status(400).send("Invalid Todo Category");

    let query = `SELECT * FROM todo WHERE todo LIKE '%${search_q}%'`;
    if (status) query += ` AND status = '${status}'`;
    if (priority) query += ` AND priority = '${priority}'`;
    if (category) query += ` AND category = '${category}'`;

    const todos = await db.all(query);
    res.send(todos);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// GET Todo by ID
app.get("/todos/:id/", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await db.get(`SELECT * FROM todo WHERE id = ?`, [id]);
    res.send(todo);
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

// GET Todos by Due Date
app.get("/agenda/", async (req, res) => {
  try {
    const { date } = req.query;
    const formattedDate = formatDate(date);
    if (!formattedDate) return res.status(400).send("Invalid Due Date");

    const todos = await db.all(`SELECT * FROM todo WHERE due_date = ?`, [formattedDate]);
    res.send(todos);
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

// POST Create Todo
app.post("/todos/", async (req, res) => {
  try {
    const { id, todo, priority, status, category, dueDate } = req.body;

    if (!isValidStatus(status)) return res.status(400).send("Invalid Todo Status");
    if (!isValidPriority(priority)) return res.status(400).send("Invalid Todo Priority");
    if (!isValidCategory(category)) return res.status(400).send("Invalid Todo Category");

    const formattedDate = formatDate(dueDate);
    if (!formattedDate) return res.status(400).send("Invalid Due Date");

    const query = `
      INSERT INTO todo (id, todo, priority, status, category, due_date)
      VALUES (?, ?, ?, ?, ?, ?)`;

    await db.run(query, [id, todo, priority, status, category, formattedDate]);
    res.send("Todo Successfully Added");
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

// PUT Update Todo
app.put("/todos/:id/", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const existingTodo = await db.get(`SELECT * FROM todo WHERE id = ?`, [id]);
    if (!existingTodo) return res.status(404).send("Todo Not Found");

    const {
      todo = existingTodo.todo,
      priority = existingTodo.priority,
      status = existingTodo.status,
      category = existingTodo.category,
      dueDate = existingTodo.due_date,
    } = updates;

    if (updates.status && !isValidStatus(updates.status)) return res.status(400).send("Invalid Todo Status");
    if (updates.priority && !isValidPriority(updates.priority)) return res.status(400).send("Invalid Todo Priority");
    if (updates.category && !isValidCategory(updates.category)) return res.status(400).send("Invalid Todo Category");
    if (updates.dueDate && !formatDate(updates.dueDate)) return res.status(400).send("Invalid Due Date");

    const formattedDate = updates.dueDate ? formatDate(updates.dueDate) : dueDate;

    const query = `
      UPDATE todo
      SET todo = ?, priority = ?, status = ?, category = ?, due_date = ?
      WHERE id = ?`;

    await db.run(query, [todo, priority, status, category, formattedDate, id]);

    const updatedField = Object.keys(updates)[0];
    const capitalizedField = updatedField.charAt(0).toUpperCase() + updatedField.slice(1);
    res.send(`${capitalizedField} Updated`);
  } catch {
    res.status(500).send("Internal Server Error");
  }
});

// DELETE Todo
app.delete("/todos/:id/", async (req, res) => {
  try {
    const { id } = req.params;
    await db.run(`DELETE FROM todo WHERE id = ?`, [id]);
    res.send("Todo Deleted");
  } catch {
    res.status(500).send("Internal Server Error");
  }
});
