const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

db.serialize(() => {
    console.log("Initializing database...");

    // Ensure Students table is NOT deleted
    db.run(`CREATE TABLE IF NOT EXISTS Students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        teacher_id INTEGER,
        student_id INTEGER,
        q1 INTEGER,
        q2 INTEGER,
        q3 INTEGER,
        q4 INTEGER,
        q5 INTEGER,
        suggestions TEXT,
        FOREIGN KEY (teacher_id) REFERENCES Teachers(id),
        FOREIGN KEY (student_id) REFERENCES Students(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Admins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )`);

    // Reset only necessary tables
    console.log("Resetting database (except Students)...");

    db.run("DELETE FROM Teachers");
    db.run("DELETE FROM Feedback");
    db.run("DELETE FROM Admins");

    // Reset ID sequence (excluding Students)
    db.run("DELETE FROM sqlite_sequence WHERE name='Teachers'");
    db.run("DELETE FROM sqlite_sequence WHERE name='Feedback'");
    db.run("DELETE FROM sqlite_sequence WHERE name='Admins'");

    console.log("Database reset complete (Students preserved)!");

    // Insert default Admin
    db.run("INSERT INTO Admins (username, password) VALUES ('admin', 'admin123')");

    // Insert new Teachers
    db.run("INSERT INTO Teachers (name) VALUES ('Mr. John')");
    db.run("INSERT INTO Teachers (name) VALUES ('Ms. Sarah')");

    // Insert new Sample Feedback (for testing)
    // db.run("INSERT INTO Feedback (teacher_id, student_id, q1, q2, q3, q4, q5, suggestions) VALUES (1, 1, 5, 4, 3, 5, 4, 'Great teaching!')");
    // db.run("INSERT INTO Feedback (teacher_id, student_id, q1, q2, q3, q4, q5, suggestions) VALUES (2, 2, 4, 5, 4, 3, 5, 'Needs more examples.')");

    console.log("Sample data inserted!");
});

module.exports = db;




const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const homeRoutes = require("./routes/home");
const studentRoutes = require("./routes/students");
const teacherRoutes = require("./routes/teachers");
const feedbackRoutes = require("./routes/feedback");
const adminRoutes = require("./routes/admin");

const session = require("express-session");

app.use(session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true
}));

app.use("/", homeRoutes);
app.use("/students", studentRoutes);
app.use("/teachers", teacherRoutes);
app.use("/feedback", feedbackRoutes);
app.use("/admin", adminRoutes);

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
