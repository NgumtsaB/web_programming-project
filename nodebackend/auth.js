const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { loadDB, saveDB } = require("./db");
const { authRequired, SECRET } = require("./middleware");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
    const { firstname, lastname, email, password, role } = req.body;
    const db = loadDB();

    if (db.users.find(u => u.email === email))
        return res.json({ error: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const newUser = {
        id: db.users.length + 1,
        firstname,
        lastname,
        email,
        password: hashed,
        role: role || "user",
        created_at: new Date().toISOString()
    };

    db.users.push(newUser);
    saveDB(db);

    res.json({ success: true, firstname, lastname });
});

// LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const db = loadDB();
    const user = db.users.find(u => u.email === email);

    if (!user) return res.status(401).json({ error: "User not found" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Wrong password" });

    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        SECRET,
        { expiresIn: "7d" }
    );

    const expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
    db.sessions.push({ token, user_id: user.id, expires });
    saveDB(db);

    res.json({ success: true, token, firstname: user.firstname, lastname: user.lastname });
});

// LOGOUT
router.post("/logout", authRequired, (req, res) => {
    const db = loadDB();
    db.sessions = db.sessions.filter(s => s.token !== req.token);
    saveDB(db);
    res.json({ success: true, message: "Logged out" });
});

module.exports = router;
