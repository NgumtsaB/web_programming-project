const jwt = require("jsonwebtoken");
const { loadDB, saveDB } = require("./db");
const SECRET = "MY_SUPER_SECRET";

function authRequired(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: "Missing token" });

    const token = auth.split(" ")[1];
    const db = loadDB();
    const session = db.sessions.find(s => s.token === token);

    if (!session) return res.status(401).json({ error: "Invalid token" });

    if (Date.now() > session.expires) {
        db.sessions = db.sessions.filter(s => s.token !== token);
        saveDB(db);
        return res.status(401).json({ error: "Token expired" });
    }

    jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(401).json({ error: "Invalid token" });
        req.user = user;
        req.token = token;
        next();
    });
}

module.exports = { authRequired, SECRET };
