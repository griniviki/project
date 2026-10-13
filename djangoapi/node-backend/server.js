const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = new Pool({
  host: process.env.PG_HOST || "127.0.0.1",
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DATABASE || "coredb",
  user: process.env.PG_USER || "viki",
  password: process.env.PG_PASSWORD || "",
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

// Get one profile by public_id
app.get("/api/users/:publicId", async (req, res) => {
  const { publicId } = req.params;
  try {
    const query = `
      SELECT public_id, username, first_name, last_name, email, avatar,
             tel, salary_before_taxes, military_tax_rate, pension_fee,
             pit_rate, salary_after_taxes, updated
      FROM core_user_user
      WHERE public_id = $1
      LIMIT 1
    `;
    const result = await pool.query(query, [publicId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("GET /api/users/:publicId error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// List users
app.get("/api/users", async (_req, res) => {
  try {
    const query = `
      SELECT public_id, username, first_name, last_name, email, avatar
      FROM core_user_user
      ORDER BY updated DESC
      LIMIT 20
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error("GET /api/users error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Posts route (join users by public_id)
app.get("/api/posts/:publicId", async (req, res) => {
  const { publicId } = req.params;
  try {
    const query = `
      SELECT p.id, p.public_id, p.author_id, p.body, p.created
      FROM core_post_post p
      JOIN core_user_user u ON p.author_id = u.id
      WHERE u.public_id = $1
      ORDER BY p.created DESC
      LIMIT 20
    `;
    const result = await pool.query(query, [publicId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.json({ results: result.rows });
  } catch (error) {
    console.error("GET /api/posts/:publicId error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
