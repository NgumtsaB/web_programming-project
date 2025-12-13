const express = require("express");
const router = express.Router();
const { loadDB, saveDB } = require("./db");
const { authRequired } = require("./middleware");


/************************************
 * GET ALL ORDERS
 * Admin → toutes
 * User → uniquement ses propres commandes
************************************/
router.get("/orders", authRequired, (req, res) => {
    const db = loadDB();

    if (req.user.role === "admin") {
        return res.json(db.orders);
    }

    const userOrders = db.orders.filter(o => o.user_id === req.user.id);
    res.json(userOrders);
});

/************************************
 * CREATE ORDER
************************************/
router.post("/orders", authRequired, (req, res) => {
    const { items = [], address = {} } = req.body;

    if (!items.length) {
        return res.status(400).json({ error: "No items" });
    }

    const db = loadDB();
    let total = 0;

    // Validate items & compute total
    for (const it of items) {
        const pid = Number(it.product_id);
        const qty = Number(it.quantity || 1);

        const prod = db.catalogue.find(p => p.id === pid);
        if (!prod) {
            return res.status(400).json({ error: `Product ${pid} not found` });
        }

        if (prod.stock < qty) {
            return res.status(400).json({
                error: `Insufficient stock for product ${pid}`
            });
        }

        total += prod.price * qty;
    }

    // Deduct stock
    for (const it of items) {
        const pid = Number(it.product_id);
        const qty = Number(it.quantity || 1);

        const prod = db.catalogue.find(p => p.id === pid);
        prod.stock = Math.max(0, prod.stock - qty);
    }

    // Create order
    const newId =
        db.orders.length ? db.orders[db.orders.length - 1].id + 1 : 1;

    const newOrder = {
        id: newId,
        user_id: req.user.id,
        status: "pending",
        items,
        total: Number(total.toFixed(2)),
        address,
        created_at: Math.floor(Date.now() / 1000)
    };

    db.orders.push(newOrder);

    // Update best sellers
    for (const it of items) {
        const pid = Number(it.product_id);
        const qty = Number(it.quantity || 1);

        for (let i = 0; i < qty; i++) {
            db.stats.best_sellers.unshift(pid);
        }
    }

    db.stats.best_sellers = db.stats.best_sellers.slice(0, 100);

    saveDB(db);

    res.status(201).json(newOrder);
});

/************************************
 * UPDATE ORDER (ADMIN ONLY)
************************************/
router.put("/orders/:id", authRequired, (req, res) => {
    const { id } = req.params;
    const payload = req.body;

    const db = loadDB();
    const order = db.orders.find(o => o.id == id);

    if (!order) {
        return res.status(404).json({ error: "Not found" });
    }

    Object.assign(order, payload);
    saveDB(db);

    res.json(order);
});

/************************************
 * DELETE ORDER (ADMIN ONLY)
************************************/
router.delete("/orders/:id", authRequired, (req, res) => {
    const { id } = req.params;

    const db = loadDB();
    const exists = db.orders.find(o => o.id == id);

    if (!exists) {
        return res.status(404).json({ error: "Not found" });
    }

    db.orders = db.orders.filter(o => o.id != id);
    saveDB(db);

    res.json({ message: "deleted" });
});

/************************************
 * STATS ENDPOINT
************************************/
router.get("/stats", (req, res) => {
    const db = loadDB();

    const bestIds = db.stats.best_sellers || [];
    const newIds = db.stats.new_arrivals || [];
    const featIds = db.stats.featured || [];
    const products = db.catalogue || [];

    const map = Object.fromEntries(products.map(p => [p.id, p]));

    const best = bestIds.map(i => map[i]).filter(Boolean).slice(0, 10);
    const newest = newIds.map(i => map[i]).filter(Boolean).slice(0, 10);
    const feat = featIds.map(i => map[i]).filter(Boolean).slice(0, 10);

    res.json({
        best_sellers: best,
        new_arrivals: newest,
        featured: feat
    });
});

module.exports = router;
