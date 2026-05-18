const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Product = require("../models/Product");

// ── Multer configuration ──────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(__dirname, "..", "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|avif|svg/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype.split("/")[1]);
  cb(null, extOk || mimeOk);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// ── Helper: validate product fields ───────────────────────────────────
function validateProduct(body) {
  const errors = [];
  if (!body.name || !body.name.trim()) errors.push("Product name is required.");
  if (body.price === undefined || body.price === "") errors.push("Price is required.");
  else if (Number(body.price) < 0) errors.push("Price must be zero or positive.");
  if (!body.category || !body.category.trim()) errors.push("Category is required.");
  if (body.rating === undefined || body.rating === "") errors.push("Rating is required.");
  else if (Number(body.rating) < 0 || Number(body.rating) > 5) errors.push("Rating must be between 0 and 5.");
  if (body.stock === undefined || body.stock === "") errors.push("Stock is required.");
  else if (Number(body.stock) < 0) errors.push("Stock must be zero or positive.");
  return errors;
}

// ── GET /admin  —  Dashboard ──────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    const categories = await Product.distinct("category");
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

    res.render("admin/dashboard", {
      products,
      categories,
      totalStock,
      totalValue,
      success: req.query.success || null,
      error: req.query.error || null,
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).send("Unable to load the admin dashboard.");
  }
});

// ── GET /admin/add  —  Add product form ───────────────────────────────
router.get("/add", async (_req, res) => {
  try {
    const categories = await Product.distinct("category");
    res.render("admin/add-product", { categories, errors: [], formData: {} });
  } catch (err) {
    console.error("Add form error:", err);
    res.status(500).send("Unable to load the add product form.");
  }
});

// ── POST /admin/add  —  Create product ────────────────────────────────
router.post("/add", upload.single("image"), async (req, res) => {
  const errors = validateProduct(req.body);

  if (errors.length > 0) {
    // Remove the uploaded file if validation fails
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    const categories = await Product.distinct("category");
    return res.render("admin/add-product", {
      categories,
      errors,
      formData: req.body,
    });
  }

  try {
    const productData = {
      name: req.body.name.trim(),
      price: Number(req.body.price),
      category: req.body.category.trim(),
      rating: Number(req.body.rating),
      stock: Number(req.body.stock),
      description: (req.body.description || "").trim(),
      image: req.file ? "/uploads/" + req.file.filename : "",
    };

    await Product.create(productData);
    res.redirect("/admin?success=Product+added+successfully");
  } catch (err) {
    console.error("Create product error:", err);
    res.redirect("/admin?error=Failed+to+create+product");
  }
});

// ── GET /admin/edit/:id  —  Edit product form ─────────────────────────
router.get("/edit/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.redirect("/admin?error=Product+not+found");

    const categories = await Product.distinct("category");
    res.render("admin/edit-product", { product, categories, errors: [] });
  } catch (err) {
    console.error("Edit form error:", err);
    res.redirect("/admin?error=Failed+to+load+edit+form");
  }
});

// ── POST /admin/edit/:id  —  Update product ───────────────────────────
router.post("/edit/:id", upload.single("image"), async (req, res) => {
  const errors = validateProduct(req.body);

  if (errors.length > 0) {
    if (req.file) fs.unlink(req.file.path, () => {});
    const product = await Product.findById(req.params.id).lean();
    const categories = await Product.distinct("category");
    return res.render("admin/edit-product", { product: { ...product, ...req.body }, categories, errors });
  }

  try {
    const updateData = {
      name: req.body.name.trim(),
      price: Number(req.body.price),
      category: req.body.category.trim(),
      rating: Number(req.body.rating),
      stock: Number(req.body.stock),
      description: (req.body.description || "").trim(),
    };

    if (req.file) {
      updateData.image = "/uploads/" + req.file.filename;

      // Delete old image if it was an uploaded file
      const oldProduct = await Product.findById(req.params.id).lean();
      if (oldProduct && oldProduct.image && oldProduct.image.startsWith("/uploads/")) {
        const oldPath = path.join(__dirname, "..", "public", oldProduct.image);
        fs.unlink(oldPath, () => {});
      }
    }

    await Product.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/admin?success=Product+updated+successfully");
  } catch (err) {
    console.error("Update product error:", err);
    res.redirect("/admin?error=Failed+to+update+product");
  }
});

// ── POST /admin/delete/:id  —  Delete product ────────────────────────
router.post("/delete/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (product && product.image && product.image.startsWith("/uploads/")) {
      const imgPath = path.join(__dirname, "..", "public", product.image);
      fs.unlink(imgPath, () => {});
    }

    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/admin?success=Product+deleted+successfully");
  } catch (err) {
    console.error("Delete product error:", err);
    res.redirect("/admin?error=Failed+to+delete+product");
  }
});

module.exports = router;
