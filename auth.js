const passport = require("passport");
const LocalStrategy = require("passport-local");
const CustomStrategy = require("passport-custom");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

module.exports = {
  init: () => {
    passport.use(
      new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        const user = await User.findOne({ where: { email } });
        if (!user) return done(null, false);
        if (!bcrypt.compareSync(password, user.password)) return done(null, false);
        return done(null, user);
      })
    );

    passport.use(
      "auth-service",
      new CustomStrategy(async function (req, done) {
        const token = req.query.token;
        let user = false;
        try {
          const decoded = jwt.verify(token, process.env.jwtKey);
          user = await User.findByPk(decoded.sub);
          if (user === null) {
            const response = await axios.get(authHost + "auth/me", { headers: { Authorization: "Bearer " + token } });
            user = await User.create(response.data);
          }
          return done(null, user);
        } catch (err) {
          req.flash("red", err.message);
          return done(null, user);
        }
      })
    );

    passport.serializeUser((user, done) => {
      done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
      const user = await User.findOne({ where: { id } });
      done(null, user);
    });
  },
  isLoggedIn: (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.group_list.includes("superadmin") || req.user.group_list.includes("admin")) {
        return next();
      }
    }
    if (req.xhr) {
      res.status(400).send("Bad Request");
      return;
    }
    req.flash("red", "Anda tidak diperbolehkan untuk mengakses halaman ini!");
    res.redirect("/auth/login");
  },
};
