const express = require("express");
const router = express.Router();
const db = require("../database"); // Ensure database connection is correct

// Route to show teacher feedback page
router.get("/", (req, res) => {
    db.all("SELECT * FROM Teachers", (err, teachers) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }

        res.render("teachers", { teachers, feedbacks: [], selectedTeacher: null });
    });
});

// Route to get feedback for a selected teacher
router.get("/:teacher_id", (req, res) => {
    const teacherId = req.params.teacher_id;

    db.all("SELECT * FROM Teachers", (err, teachers) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        }

        db.all("SELECT * FROM Feedback WHERE teacher_id = ?", [teacherId], (err, feedbacks) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Database error");
            }

            res.render("teachers", { teachers, feedbacks, selectedTeacher: teacherId });
        });
    });
});

module.exports = router;
