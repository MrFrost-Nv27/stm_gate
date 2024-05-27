const passport = require("passport");

module.exports = {
  login: (req, res) => {
    if (req.query.token) {
      passport.authenticate("auth-service", {
        successRedirect: "/",
        failureRedirect: "/auth/login",
      })(req, res);
      return;
    }
    res.render("auth/login", {
      layout: "layouts/auth/main",
    });
  },

  loginAction: (req, res) => {
    passport.authenticate("auth-service", {
      successRedirect: "/",
      failureRedirect: "/auth/login",
    })(req, res);
  },

  logout: (req, res) => {
    // TODO: complete
    req.logout(() => {
      req.flash("green", "Anda telah keluar dari halaman ini");
      res.redirect("/auth/login");
    });
  },
};
