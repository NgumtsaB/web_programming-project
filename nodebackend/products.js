const express = require("express");
const router = express.Router();
const { loadDB, saveDB } = require("./db");
const { authRequired } = require("./middleware");

/************************************
 * GET ALL PRODUCTS
************************************/
router.get("/products", (req, res) => {
    const db = loadDB();
    res.json(db.catalogue);
});

/************************************
 * GET ONE PRODUCT
************************************/
router.get("/products/:id", (req, res) => {
    const { id } = req.params;
    const db = loadDB();

    const product = db.catalogue.find(p => p.id == id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
});

/************************************
 * CREATE PRODUCT
************************************/
router.post("/products", authRequired, (req, res) => {
    const { title, description, price, category_id, stock, images } = req.body;

    const db = loadDB();

    // Vérifier catégorie
    const category = db.categories.find(c => c.id == category_id);
    if (!category)
        return res.status(400).json({ error: "Invalid category_id" });

    const newProduct = {
        id: db.catalogue.length ? db.catalogue[db.catalogue.length - 1].id + 1 : 1,
        title,
        description,
        price: Number(price),
        category_id,
        stock: Number(stock),
        likes: 0,
        views: 0,
        created_at: Date.now(),
        images: images || []
    };

    db.catalogue.push(newProduct);
    saveDB(db);

    res.json({
        success: true,
        message: "Product created",
        product: newProduct
    });
});

/************************************
 * UPDATE PRODUCT
************************************/
router.put("/products/:id", authRequired, (req, res) => {
    const { id } = req.params;
    const db = loadDB();
    const product = db.catalogue.find(p => p.id == id);

    if (!product) return res.status(404).json({ error: "Product not found" });

    const { title, description, price, category_id, stock, images } = req.body;

    if (category_id !== undefined) {
        const category = db.categories.find(c => c.id == category_id);
        if (!category) {
            return res.status(400).json({ error: "Invalid category_id" });
        }
        product.category_id = category_id;
    }

    if (title) product.title = title;
    if (description) product.description = description;
    if (price) product.price = Number(price);
    if (stock) product.stock = Number(stock);
    if (images) product.images = images;

    saveDB(db);

    res.json({
        success: true,
        message: "Product updated",
        product
    });
});

/************************************
 * DELETE PRODUCT
************************************/
router.delete("/products/:id", authRequired, (req, res) => {
    const { id } = req.params;

    const db = loadDB();
    const product = db.catalogue.find(p => p.id == id);

    if (!product) return res.status(404).json({ error: "Product not found" });

    db.catalogue = db.catalogue.filter(p => p.id != id);
    saveDB(db);

    res.json({
        success: true,
        message: "Product deleted"
    });
});

/************************************
 * GET PRODUCTS BY CATEGORY
************************************/
router.get("/products/category/:category_id", (req, res) => {
    const { category_id } = req.params;
    const db = loadDB();

    // Vérifier si la catégorie existe
    const category = db.categories.find(c => c.id == category_id);
    if (!category) {
        return res.status(404).json({ error: "Category not found" });
    }

    // Récupérer produits de cette catégorie
    const products = db.catalogue.filter(p => p.category_id == category_id);

    res.json({
        category: category.name,
        total: products.length,
        products
    });
});


module.exports = router;
