const isLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  req.flash("error", "You must be logged in to view this page.");
  return res.redirect("/signin");
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    return next();
  }
  req.flash("error", "Access Denied. Admins only.");
  return res.redirect("/");
};

module.exports = {
  isLoggedIn,
  isAdmin,
};
