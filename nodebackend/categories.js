const express = require("express");
const { loadDB, saveDB } = require("./db");
const { authRequired } = require("./middleware");

const router = express.Router();

/*******************************
 * GET ALL CATEGORIES
*******************************/
router.get("/categories", (req, res) => {
    const db = loadDB();
    res.json(db.categories);
});

/*******************************
 * CREATE CATEGORY
*******************************/
router.post("/categories", authRequired, (req, res) => {
    const { name } = req.body;

    if (!name) return res.status(400).json({ error: "Name is required" });

    const db = loadDB();

    // slug = name en version URL safe
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/'/g, "-");

    const newCategory = {
        id: db.categories.length + 1,
        name,
        slug
    };

    db.categories.push(newCategory);
    saveDB(db);

    res.json({ success: true, category: newCategory });
});

/*******************************
 * UPDATE CATEGORY
*******************************/
router.put("/categories/:id", authRequired, (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const db = loadDB();
    const category = db.categories.find(c => c.id == id);

    if (!category) return res.status(404).json({ error: "Category not found" });

    if (name) {
        category.name = name;
        category.slug = name.toLowerCase().replace(/ /g, "-").replace(/'/g, "-");
    }

    saveDB(db);

    res.json({ success: true, category });
});

/*******************************
 * DELETE CATEGORY
*******************************/
router.delete("/categories/:id", authRequired, (req, res) => {
    const { id } = req.params;

    const db = loadDB();
    const exists = db.categories.find(c => c.id == id);

    if (!exists) return res.status(404).json({ error: "Category not found" });

    db.categories = db.categories.filter(c => c.id != id);
    saveDB(db);

    res.json({ success: true, message: "Category deleted" });
});

module.exports = router;
