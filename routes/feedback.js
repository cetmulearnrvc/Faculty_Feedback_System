const express = require("express");
const router = express.Router();
const db = require("../database"); // Use database.js

// Show feedback form (students)
router.get("/new", (req, res) => {
    const student_id = req.query.student_id;

    db.all("SELECT * FROM Teachers", [], (err, teachers) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.render("feedback", { teachers, student_id });
        }
    });
});

// Submit feedback
router.post("/submit", (req, res) => {
    const { student_id, teacher_id, q1, q2, q3, q4, q5, suggestions } = req.body;

    db.run(
        `INSERT INTO Feedback (student_id, teacher_id, q1, q2, q3, q4, q5, suggestions) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [student_id, teacher_id, q1, q2, q3, q4, q5, suggestions],
        function (err) {
            if (err) res.status(500).json({ error: err.message });
            else res.redirect("/students");
        }
    );
});

// Admin view all feedback
router.get("/admin", (req, res) => {
    db.all("SELECT * FROM Feedback", [], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.render("admin", { feedback: rows });
    });
});

// Teacher view feedback
router.get("/teacher/:teacher_id", (req, res) => {
    const teacher_id = req.params.teacher_id;

    db.all(
        "SELECT * FROM Feedback WHERE teacher_id = ?",
        [teacher_id],
        (err, rows) => {
            if (err) res.status(500).json({ error: err.message });
            else res.render("teachers", { feedback: rows });
        }
    );
});

module.exports = router;
