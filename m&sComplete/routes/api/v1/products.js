const express = require("express");
const router = express.Router();
const Product = require("../../../models/Product");

const parseOptionalPrice = (value) => {
  if (value === undefined || value === "") return "";
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : "";
};

// @route   GET /api/v1/products
// @desc    Get all products with filtering & pagination
router.get("/", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = parseInt(req.query.limit, 10) || 8;
    const search = (req.query.search || "").trim();
    const category = (req.query.category || "").trim();
    const minPrice = parseOptionalPrice(req.query.minPrice);
    const maxPrice = parseOptionalPrice(req.query.maxPrice);
    const sort = (req.query.sort || "featured").trim();

    const filter = {};
    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) filter.category = category;
    if (minPrice !== "" || maxPrice !== "") {
      filter.price = {};
      if (minPrice !== "") filter.price.$gte = minPrice;
      if (maxPrice !== "") filter.price.$lte = maxPrice;
    }

    const sortOptions = {
      featured: { rating: -1, stock: -1, name: 1 },
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
      ratingDesc: { rating: -1 },
      nameAsc: { name: 1 },
    };

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort(sortOptions[sort] || sortOptions.featured)
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        limit,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET /api/v1/products/:id
// @desc    Get product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
