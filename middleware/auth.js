module.exports = {
  // Ensure that user is authenticated
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  },

  // Ensure that user is not authenticated
  ensureNotAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/");
  },

  // Ensure that user is an admin
  ensureAdmin: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return res.redirect("/login");
    } else if (req.user.role === "Admin") {
      next();
    } else {
      return res.redirect("/");
    }
  },
};
