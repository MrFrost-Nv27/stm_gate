const express = require("express");
const { isLoggedIn } = require("../auth");

const router = express.Router();

router.ws("/", function (ws, req) {
  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });
  ws.on("error", console.error);
  // expressWs.getWss(req).clients.forEach(function each(client) {
  //   client.send("something");
  // });
});

router.ws("/whatsapp", function (ws, req) {
  ws.send(JSON.stringify({
    message: "Selamat datang, " + req.user.username,
  }));
  ws.on("message", function message(data) {
    console.log("diambil dari whatsapp: %s", data);
  });
  ws.on("error", console.error);
});

module.exports = router;
