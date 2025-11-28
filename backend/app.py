from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import json
import os
import tempfile
import time
import secrets

DB_FILE = "db.json"
TOKEN_EXPIRY_SECONDS = 60 * 60 * 24 * 7  # token valide 7 jours

app = Flask(__name__)
CORS(app)  # autorise les requêtes depuis ton frontend

# -----------------------
# Helpers: read/write db
# -----------------------
def load_db():
    if not os.path.exists(DB_FILE):
        # create empty DB template if missing
        with open(DB_FILE, "w", encoding="utf-8") as f:
            json.dump({
                "users": [],
                "categories": [],
                "catalogue": [],
                "comments": [],
                "likes": [],
                "orders": [],
                "stats": {"best_sellers": [], "new_arrivals": [], "featured": []},
                "sessions": []
            }, f, indent=4, ensure_ascii=False)
    with open(DB_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def save_db(db):
    # write atomically to avoid partial writes
    dirpath = os.path.dirname(os.path.abspath(DB_FILE)) or "."
    fd, tmp_path = tempfile.mkstemp(dir=dirpath, text=True)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as tmp:
            json.dump(db, tmp, indent=4, ensure_ascii=False)
        os.replace(tmp_path, DB_FILE)
    except Exception:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        raise

def next_id(items):
    if not items:
        return 1
    return max(item.get("id", 0) for item in items) + 1

# -----------------------
# Authentication helpers
# -----------------------
def create_token(user_id):
    token = secrets.token_hex(32)
    db = load_db()
    expiry = int(time.time()) + TOKEN_EXPIRY_SECONDS
    db["sessions"].append({"token": token, "user_id": user_id, "expires": expiry})
    save_db(db)
    return token

def revoke_token(token):
    db = load_db()
    db["sessions"] = [s for s in db["sessions"] if s["token"] != token]
    save_db(db)

def get_user_by_token(token):
    if not token:
        return None
    db = load_db()
    now = int(time.time())
    for s in db.get("sessions", []):
        if s["token"] == token and s.get("expires", 0) > now:
            uid = s["user_id"]
            for u in db.get("users", []):
                if u["id"] == uid:
                    return u
    return None

def auth_required(fn):
    def wrapper(*args, **kwargs):
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth.split(" ", 1)[1]
        else:
            token = None
        user = get_user_by_token(token)
        if not user:
            return jsonify({"error": "Unauthorized"}), 401
        request.user = user  # attach current user to request
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper

def admin_required(fn):
    @auth_required
    def wrapper(*args, **kwargs):
        u = request.user
        if u.get("role") != "admin":
            return jsonify({"error": "Admin only"}), 403
        return fn(*args, **kwargs)
    wrapper.__name__ = fn.__name__
    return wrapper

# -----------------------
# Auth: register / login / logout
# -----------------------
@app.post("/api/register")
def register():
    payload = request.json or {}
    firstname = payload.get("firstname")
    lastname = payload.get("lastname")
    email = (payload.get("email") or "").lower()
    password = payload.get("password")
    role = payload.get("role", "customer")  # default role

    if not firstname or not lastname or not email or not password:
        return jsonify({"error": "Missing fields"}), 400

    db = load_db()
    if any(u for u in db["users"] if u["email"].lower() == email):
        return jsonify({"error": "Email already used"}), 400

    uid = next_id(db["users"])
    hashed = generate_password_hash(password)
    user = {
        "id": uid,
        "firstname": firstname,
        "lastname": lastname,
        "email": email,
        "password": hashed,
        "role": role,
        "created_at": int(time.time())
    }
    db["users"].append(user)
    save_db(db)

    token = create_token(uid)
    return jsonify({"message": "registered", "token": token, "user": {k:v for k,v in user.items() if k!="password"}}), 201

@app.post("/api/login")
def login():
    payload = request.json or {}
    email = (payload.get("email") or "").lower()
    password = payload.get("password") or ""

    db = load_db()
    user = next((u for u in db["users"] if u["email"].lower() == email), None)
    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_token(user["id"])
    return jsonify({"message": "ok", "token": token, "user": {k:v for k,v in user.items() if k!="password"}})

@app.post("/api/logout")
@auth_required
def logout():
    auth = request.headers.get("Authorization", "")
    token = auth.split(" ", 1)[1] if auth.startswith("Bearer ") else None
    revoke_token(token)
    return jsonify({"message": "logged out"})

# -----------------------
# Categories CRUD
# -----------------------
@app.get("/api/categories")
def list_categories():
    db = load_db()
    return jsonify(db["categories"])

@app.post("/api/categories")
@admin_required
def create_category():
    payload = request.json or {}
    name = payload.get("name")
    slug = payload.get("slug") or (name or "").lower().replace(" ", "-")
    if not name:
        return jsonify({"error": "Missing name"}), 400
    db = load_db()
    cid = next_id(db["categories"])
    cat = {"id": cid, "name": name, "slug": slug}
    db["categories"].append(cat)
    save_db(db)
    return jsonify(cat), 201

@app.put("/api/categories/<int:cat_id>")
@admin_required
def update_category(cat_id):
    payload = request.json or {}
    db = load_db()
    for c in db["categories"]:
        if c["id"] == cat_id:
            c.update({k:v for k,v in payload.items() if k in ["name","slug"]})
            save_db(db)
            return jsonify(c)
    return jsonify({"error":"Not found"}), 404

@app.delete("/api/categories/<int:cat_id>")
@admin_required
def delete_category(cat_id):
    db = load_db()
    db["categories"] = [c for c in db["categories"] if c["id"] != cat_id]
    save_db(db)
    return jsonify({"message":"deleted"})

# -----------------------
# Products (catalogue) CRUD
# -----------------------
@app.get("/api/products")
def list_products():
    db = load_db()
    # support optional query params: category_id, q (search), sort (new, best)
    category = request.args.get("category_id", type=int)
    q = request.args.get("q", type=str)
    sort = request.args.get("sort", type=str)  # "new", "best", "price_asc" ...
    prods = db["catalogue"]
    if category:
        prods = [p for p in prods if p.get("category_id") == category]
    if q:
        ql = q.lower()
        prods = [p for p in prods if ql in (p.get("title","").lower() + p.get("description","").lower())]
    if sort == "new":
        prods = sorted(prods, key=lambda p: p.get("created_at",0), reverse=True)
    if sort == "best":
        # rely on stats.best_sellers if present
        ids = db.get("stats", {}).get("best_sellers", [])
        prods = sorted(prods, key=lambda p: ids.index(p["id"]) if p["id"] in ids else 9999)
    return jsonify(prods)

@app.get("/api/products/<int:pid>")
def get_product(pid):
    db = load_db()
    p = next((x for x in db["catalogue"] if x["id"] == pid), None)
    if not p:
        return jsonify({"error":"Not found"}), 404
    return jsonify(p)

@app.post("/api/products")
@admin_required
def create_product():
    title = request.form.get("title")
    price = float(request.form.get("price", 0))
    category_id = int(request.form.get("category_id", 0))
    
    images = []
    if "images" in request.files:
        for f in request.files.getlist("images"):
            filename = f"{int(time.time())}_{f.filename}"
            f.save(os.path.join("static/images", filename))
            images.append(f"static/images/{filename}")
    
    db = load_db()
    pid = next_id(db["catalogue"])
    product = {
        "id": pid,
        "title": title,
        "price": price,
        "category_id": category_id,
        "stock": int(request.form.get("stock",0)),
        "likes": 0,
        "views": 0,
        "created_at": int(time.time()),
        "images": images
    }
    db["catalogue"].append(product)
    db["stats"]["new_arrivals"].insert(0, pid)
    db["stats"]["new_arrivals"] = db["stats"]["new_arrivals"][:20]
    save_db(db)
    return jsonify(product), 201

@app.put("/api/products/<int:pid>")
@admin_required
def update_product(pid):
    payload = request.json or {}
    db = load_db()
    for p in db["catalogue"]:
        if p["id"] == pid:
            # allowed updates
            for k in ["title","description","price","category_id","stock","images","likes","views"]:
                if k in payload:
                    p[k] = payload[k]
            save_db(db)
            return jsonify(p)
    return jsonify({"error":"Not found"}), 404

@app.delete("/api/products/<int:pid>")
@admin_required
def delete_product(pid):
    db = load_db()
    db["catalogue"] = [p for p in db["catalogue"] if p["id"] != pid]
    # also remove related comments/likes
    db["comments"] = [c for c in db["comments"] if c["product_id"] != pid]
    db["likes"] = [l for l in db["likes"] if l["product_id"] != pid]
    # clean stats
    for key in ["best_sellers","new_arrivals","featured"]:
        db["stats"][key] = [i for i in db["stats"].get(key,[]) if i != pid]
    save_db(db)
    return jsonify({"message":"deleted"})

# -----------------------
# Likes / Comments
# -----------------------
@app.post("/api/products/<int:pid>/like")
@auth_required
def like_product(pid):
    user = request.user
    db = load_db()
    # toggle like
    exists = next((l for l in db["likes"] if l["user_id"]==user["id"] and l["product_id"]==pid), None)
    if exists:
        db["likes"] = [l for l in db["likes"] if not (l["user_id"]==user["id"] and l["product_id"]==pid)]
        # decrement count if exists in product
        for p in db["catalogue"]:
            if p["id"]==pid:
                p["likes"] = max(0, p.get("likes",0)-1)
    else:
        db["likes"].append({"user_id": user["id"], "product_id": pid, "created_at": int(time.time())})
        for p in db["catalogue"]:
            if p["id"]==pid:
                p["likes"] = p.get("likes",0)+1
    save_db(db)
    return jsonify({"message":"ok"})

@app.post("/api/products/<int:pid>/comment")
@auth_required
def comment_product(pid):
    payload = request.json or {}
    content = payload.get("content")
    rating = int(payload.get("rating", 0))
    if not content:
        return jsonify({"error":"Missing content"}), 400
    db = load_db()
    cid = next_id(db["comments"])
    comment = {
        "id": cid,
        "product_id": pid,
        "user_id": request.user["id"],
        "content": content,
        "rating": rating,
        "created_at": int(time.time())
    }
    db["comments"].append(comment)
    save_db(db)
    return jsonify(comment), 201

@app.get("/api/products/<int:pid>/comments")
def product_comments(pid):
    db = load_db()
    return jsonify([c for c in db["comments"] if c["product_id"]==pid])

# -----------------------
# Orders CRUD
# -----------------------
@app.get("/api/orders")
@auth_required
def list_orders():
    user = request.user
    db = load_db()
    if user.get("role") == "admin":
        return jsonify(db["orders"])
    # else return only user's orders
    return jsonify([o for o in db["orders"] if o["user_id"] == user["id"]])

@app.post("/api/orders")
@auth_required
def place_order():
    payload = request.json or {}
    items = payload.get("items", [])
    address = payload.get("address", {})
    if not items:
        return jsonify({"error":"No items"}), 400
    db = load_db()
    oid = next_id(db["orders"])
    total = 0.0
    # validate items and compute total
    for it in items:
        pid = int(it.get("product_id"))
        qty = int(it.get("quantity",1))
        prod = next((p for p in db["catalogue"] if p["id"]==pid), None)
        if not prod:
            return jsonify({"error": f"Product {pid} not found"}), 400
        if prod.get("stock", 0) < qty:
            return jsonify({"error": f"Insufficient stock for product {pid}"}), 400
        total += prod.get("price",0.0) * qty
    # all good: deduct stock and create order
    for it in items:
        pid = int(it.get("product_id"))
        qty = int(it.get("quantity",1))
        prod = next((p for p in db["catalogue"] if p["id"]==pid), None)
        prod["stock"] = max(0, prod.get("stock",0) - qty)
    order = {
        "id": oid,
        "user_id": request.user["id"],
        "status": "pending",
        "items": items,
        "total": round(total, 2),
        "address": address,
        "created_at": int(time.time())
    }
    db["orders"].append(order)
    # update best_sellers naive: push product ids per qty
    for it in items:
        pid = int(it.get("product_id"))
        qty = int(it.get("quantity",1))
        for _ in range(qty):
            db["stats"]["best_sellers"].insert(0, pid)
    db["stats"]["best_sellers"] = db["stats"]["best_sellers"][:100]
    save_db(db)
    return jsonify(order), 201

@app.put("/api/orders/<int:oid>")
@admin_required
def update_order(oid):
    payload = request.json or {}
    db = load_db()
    for o in db["orders"]:
        if o["id"] == oid:
            o.update(payload)
            save_db(db)
            return jsonify(o)
    return jsonify({"error":"Not found"}), 404

@app.delete("/api/orders/<int:oid>")
@admin_required
def delete_order(oid):
    db = load_db()
    db["orders"] = [o for o in db["orders"] if o["id"] != oid]
    save_db(db)
    return jsonify({"message":"deleted"})

# -----------------------
# Stats endpoints
# -----------------------
@app.get("/api/stats")
def stats():
    db = load_db()
    # compute recommended payload
    best_ids = db.get("stats", {}).get("best_sellers", [])
    new_ids = db.get("stats", {}).get("new_arrivals", [])
    featured = db.get("stats", {}).get("featured", [])
    products = db.get("catalogue", [])
    id_map = {p["id"]: p for p in products}
    best = [id_map[i] for i in best_ids if i in id_map][:10]
    new = [id_map[i] for i in new_ids if i in id_map][:10]
    feat = [id_map[i] for i in featured if i in id_map][:10]
    return jsonify({"best_sellers": best, "new_arrivals": new, "featured": feat})

# -----------------------
# Simple admin bootstrap route (for dev only)
# -----------------------
@app.post("/api/bootstrap-admin")
def bootstrap_admin():
    payload = request.json or {}
    email = payload.get("email", "admin@example.com")
    password = payload.get("password", "password")
    db = load_db()
    if any(u for u in db["users"] if u.get("role") == "admin"):
        return jsonify({"message":"admin exists"}), 200
    uid = next_id(db["users"])
    admin = {
        "id": uid,
        "firstname": "Admin",
        "lastname": "User",
        "email": email,
        "password": generate_password_hash(password),
        "role": "admin",
        "created_at": int(time.time())
    }
    db["users"].append(admin)
    save_db(db)
    token = create_token(uid)
    return jsonify({"message":"admin created", "token": token}), 201

# -----------------------
# Home
# -----------------------
@app.route("/")
def home():
    return "Hello, world!"

# -----------------------
# Run
# -----------------------
if __name__ == "__main__":
    # ensure DB exists
    load_db()
    app.run(debug=True, port=5000)
