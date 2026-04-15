const express = require("express");
const router = express.Router();
const pool = require("../db");
const { v4: uuidv4 } = await import("uuid");

router.get("/api/post", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.public_id,
             p.body,
             p.linguistics_type,
             p.created,
             p.updated,
             json_agg(
               json_build_object(
                 'language', json_build_object('code', l.code, 'name', l.name),
                 'title', m.title,
                 'body', m.body
               )
             ) AS metadata
      FROM core_post p
      LEFT JOIN core_post_metadata m ON p.public_id = m.post_id
      LEFT JOIN core_language l ON m.language_id = l.code
      GROUP BY p.public_id, p.body, p.linguistics_type, p.created, p.updated
      ORDER BY p.created DESC;
    `);

    res.setHeader("Cache-Control", "no-store");   // ✅ prevent 304
    res.json(result.rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create a new post with metadata
router.post("/api/post", async (req, res) => {
  const { body, linguistics_type, metadata } = req.body;

  try {
    // Generate UUID for the post
    const public_id = uuidv4();

    // Insert into core_post
    await pool.query(
      `INSERT INTO core_post (public_id, body, linguistics_type, created, updated)
       VALUES ($1, $2, $3, NOW(), NOW())`,
      [public_id, body, linguistics_type || "none"]
    );

    // Insert metadata (array of translations)
    if (Array.isArray(metadata)) {
      for (const m of metadata) {
        await pool.query(
          `INSERT INTO core_post_metadata (title, body, category_id, language_id, post_id)
           VALUES ($1, $2, $3, $4, $5)`,
          [m.title, m.body, m.category_id, m.language.code, public_id]
        );
      }
    }

    res.status(201).json({ message: "Post created successfully", public_id });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;