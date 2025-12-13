const fs = require("fs");
const DB_FILE = "db.json";

function loadDB() {
    const data = fs.readFileSync(DB_FILE, "utf8");
    return JSON.parse(data);
}

function saveDB(db) {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

module.exports = { loadDB, saveDB };
