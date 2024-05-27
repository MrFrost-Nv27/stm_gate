const express = require("express");
const authController = require("../controllers/auth");
const { isLoggedIn } = require("../auth");

const router = express.Router();

router.get("/", isLoggedIn, (req, res) => {
  res.render("dashboard");
});

router.ws("/", function (ws, req) {
  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });
  ws.on("error", console.error);
  expressWs.getWss(req).clients.forEach(function each(client) {
    client.send("something");
  })
});

registerController(authController, "/auth", router);

module.exports = router;
