const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();

router.get("/signin", (req, res) => {
  res.render("signin");
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    if (password.length < 6) {
      req.flash("error", "Password must be at least 6 characters long.");
      return res.redirect("/signin");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash("error", "Email is already registered.");
      return res.redirect("/signin");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    req.flash("success", "Registration successful. Please log in.");
    res.redirect("/signin");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong during registration.");
    res.redirect("/signin");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/signin");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/signin");
    }

    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    req.flash("success", `Welcome back, ${user.name}!`);
    if (user.role === "admin") {
      res.redirect("/admin/products");
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong during login.");
    res.redirect("/signin");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    res.redirect("/");
  });
});

router.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/signin");
  }
  res.render("profile", { user: req.session.user });
});

module.exports = router;
