const express = require("express");
const router = express.Router();
const db = require("../database");

router.get("/", (req, res) => {
    if (!req.session || !req.session.admin) {
        return res.render("admin", { login: true, error: null });
    }

    db.all("SELECT * FROM Feedback", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.render("admin", { login: false, feedback: rows });
        }
    });
});

router.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    db.get("SELECT * FROM Admins WHERE username = ? AND password = ?", [username, password], (err, admin) => {
        if (err) return res.status(500).send("Database error");
        
        if (admin) {
            req.session.admin = admin.id;
            return res.redirect("/admin");
        } else {
            return res.render("admin", { login: true, error: "Invalid username or password" });
        }
    });
});

module.exports = router;
