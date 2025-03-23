const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();

// Connect to database
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error("❌ Database Connection Error:", err.message);
  else console.log("✅ Connected to SQLite database.");
});

// Get all students
router.get("/", (req, res) => {
  db.all("SELECT * FROM Students", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      console.log("Fetched students:", rows);
      res.render("students", { students: rows });
    }
  });
});

// Add a student
router.post("/add", (req, res) => {
  const { name, gender, age, address } = req.body;
  db.run(
    "INSERT INTO Students (name, gender, age, address) VALUES (?, ?, ?, ?)",
    [name, gender, age, address],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.redirect("/students");
    }
  );
});

module.exports = router;
