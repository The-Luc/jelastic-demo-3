require("dotenv").config();

const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

app.use(express.json());

app.get("/items", async (req, res) => {
  const result = await pool.query("SELECT * FROM items");
  res.json(result.rows);
});

app.post("/items", async (req, res) => {
  console.log(req.body);
  const { name } = req.body;
  const result = await pool.query(
    "INSERT INTO items (name) VALUES ($1) RETURNING *",
    [name],
  );
  res.json(result.rows[0]);
});

app.put("/items/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const result = await pool.query(
    "UPDATE items SET name = $1 WHERE id = $2 RETURNING *",
    [name, id],
  );
  res.json(result.rows[0]);
});

app.delete("/items/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM items WHERE id = $1", [id]);
  res.sendStatus(204);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log("Check me 2");
});
