const express = require("express");
const authRoutes = require("./auth");
const { authRequired } = require("./middleware");
const categoryRoutes = require("./categories");
const { loadDB } = require("./db");
const listEndpoints = require("express-list-endpoints");
const productRoutes = require("./products");
const orderRoutes = require("./orders");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors())


// Auth routes
app.use("/", authRoutes);
app.use("/", categoryRoutes);
app.use("/", productRoutes);
app.use("/", orderRoutes);




console.log(listEndpoints(app));
app.get("/profile", authRequired, (req, res) => {
    const db = loadDB();
    const user = db.users.find(u => u.id === req.user.id);
    res.json({
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        role: user.role,
        created_at: user.created_at
    });
});

app.listen(3000, () => console.log("Server running on port 3000"));
