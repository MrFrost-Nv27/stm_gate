require("dotenv").config();

const express = require("express");
const passport = require("passport");
const sqlite = require("better-sqlite3");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

let expressWs = require("express-ws");
expressWs = expressWs(express());
const app = expressWs.app;
const morgan = require("morgan");
const port = process.env.PORT || 8080;
const host = process.env.HOST || "localhost";
const cors = require("cors");

const expressEjsLayouts = require("express-ejs-layouts");

app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressEjsLayouts);
app.use(morgan("dev"));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set("view engine", "ejs");
app.set("layout", "layouts/panel/main");

app.options("*", cors());

const { Case } = require("change-case-all");
const { DateTime, Settings } = require("luxon");
Settings.defaultLocale = "id";
const db = require("./db.js");
const { init: initAuth } = require("./auth");
const expressListRoutes = require("express-list-routes");
const flash = require("express-flash");
const auth = require("./auth");

initAuth();
const SqliteStore = require("better-sqlite3-session-store")(session);
const dbSession = new sqlite(".tmp/sessions.db");
app.use(
  session({
    store: new SqliteStore({
      client: dbSession,
      expired: {
        clear: true,
        intervalMs: 900000, //ms = 15min
      },
    }),
    secret: process.env.encryptionKey || "keyboard cat",
    resave: false,
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

global.getFiles = require("./utils/getFiles");
global._ = require("lodash");
global.Case = Case;
global.registerController = require("./utils/registerController.js");
global.DateTime = DateTime;
global.jwt = require("jsonwebtoken");
global.axios = require("axios");
global.authHost = process.env.authHost;
global.expressWs = expressWs;

app.use(function (req, res, next) {
  res.locals.user = req.user;
  req.testing = "testing";
  next();
});

app.locals.authUrl = authHost + "auth/service?auth_type=jwt&redirect_url=";
app.locals.page = "dashboard";

app.use(require("./routes/web.js"));

expressListRoutes(app);

let protocol = process.env.PROTOCOL || "http";
let server;

db.sync({ force: false }).then(() => {
  server = app.listen(port, host, () => {
    console.log(`Server is running at: http://${host}:${port}`);
  });

  global.getBaseUrl = () => {
    if (port == 80) {
      return `${protocol}://${host}/`;
    }
    return `${protocol}://${host}:${port}/`;
  };
});
