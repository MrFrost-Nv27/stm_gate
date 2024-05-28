const express = require("express");
const authController = require("../controllers/auth");
const panelController = require("../controllers/panel");
const { isLoggedIn } = require("../auth");

const router = express.Router();

router.get("/", isLoggedIn, (req, res) => {
  res.render("dashboard");
});

registerController(authController, "/auth", router);
registerController(panelController, "/panel", router);

module.exports = router;
