const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Product = require("./models/Product");

const app = express();
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/assignment3";

//EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

const parseOptionalPrice = (value) => {
  if (value === undefined || value === "") {
    return "";
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : "";
};

const buildProductLink = (filters, page) => {
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.category) params.set("category", filters.category);
  if (filters.minPrice !== "") params.set("minPrice", filters.minPrice);
  if (filters.maxPrice !== "") params.set("maxPrice", filters.maxPrice);
  if (filters.sort && filters.sort !== "featured") params.set("sort", filters.sort);
  params.set("page", String(page));

  return `/products?${params.toString()}`;
};

app.get("/", (req, res) => {
  return res.render("homepage");
});

app.get("/products", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = 8;
    const search = (req.query.search || "").trim();
    const category = (req.query.category || "").trim();
    const minPrice = parseOptionalPrice(req.query.minPrice);
    const maxPrice = parseOptionalPrice(req.query.maxPrice);
    const sort = (req.query.sort || "featured").trim();

    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice !== "" || maxPrice !== "") {
      filter.price = {};

      if (minPrice !== "") {
        filter.price.$gte = minPrice;
      }

      if (maxPrice !== "") {
        filter.price.$lte = maxPrice;
      }
    }

    const sortOptions = {
      featured: { rating: -1, stock: -1, name: 1 },
      priceAsc: { price: 1 },
      priceDesc: { price: -1 },
      ratingDesc: { rating: -1 },
      nameAsc: { name: 1 },
    };

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(totalProducts / limit), 1);
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * limit;
    const products = await Product.find(filter)
      .sort(sortOptions[sort] || sortOptions.featured)
      .skip(skip)
      .limit(limit)
      .lean();

    const categories = await Product.distinct("category");

    return res.render("products", {
      products,
      categories: categories.sort(),
      currentPage,
      totalPages,
      totalProducts,
      filters: {
        search,
        category,
        minPrice,
        maxPrice,
        sort,
      },
      buildProductLink: (pageNumber) => buildProductLink({ search, category, minPrice, maxPrice, sort }, pageNumber),
    });
  } catch (error) {
    console.error("Failed to load products:", error);
    return res.status(500).send("Unable to load the product catalog right now.");
  }
});

app.get("/women", (req, res) => res.render("women"));
app.get("/men", (req, res) => res.render("men"));
app.get("/kids", (req, res) => res.render("kids"));
app.get("/gift", (req, res) => res.render("gift"));
app.get("/beauty", (req, res) => res.render("beauty"));
app.get("/sale", (req, res) => res.render("sale"));
app.get("/signin", (req, res) => res.render("signin"));

async function startServer() {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Connected to MongoDB");

    app.listen(port, () => {
      console.log(`Server Started at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();