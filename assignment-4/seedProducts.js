const mongoose = require("mongoose");
const Product = require("./models/Product");
const products = require("./data/products");

const mongoUrl = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/assignment3";

async function seedDatabase() {
  try {
    await mongoose.connect(mongoUrl);
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products.`);
  } catch (error) {
    console.error("Seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();