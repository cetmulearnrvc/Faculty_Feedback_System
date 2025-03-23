const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {
    if (err) console.error("Database connection error:", err.message);
    else console.log("Connected to SQLite database.");
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS Students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT, gender TEXT, age INTEGER, address TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT, gender TEXT, age INTEGER, subject TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS Feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER, teacher_id INTEGER,
        q1 INTEGER, q2 INTEGER, q3 INTEGER, q4 INTEGER, q5 INTEGER,
        suggestions TEXT,
        FOREIGN KEY(student_id) REFERENCES Students(id),
        FOREIGN KEY(teacher_id) REFERENCES Teachers(id)
    )`);
});

module.exports = db;
