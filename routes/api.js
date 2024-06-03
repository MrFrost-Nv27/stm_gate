const express = require("express");
const { isLoggedIn } = require("../auth");
const Whatsapp = require("../models/Whatsapp");

const router = express.Router();

router.get("/api/whatsapp", isLoggedIn, async (req, res) => {
  res.json(await Whatsapp.findAll());
});
router.post("/api/whatsapp", isLoggedIn, async (req, res) => {
  const wa = await Whatsapp.create(req.body);
  res.json({
    success: true,
    data: wa,
  });
});
router.post("/api/whatsapp/scan", isLoggedIn, async (req, res) => {
  const wa = await Whatsapp.findByPk(req.body.id);

  const Pusher = require("pusher");
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: "ap1",
    useTLS: true,
  });
  pusher.trigger("scanner", "scanning", {
    message: "Connecting",
    id: wa.id,
    session: wa.session,
  });

  const fs = require("fs");
  const venom = require("venom-bot");
  const path = require("path");

  venom
    .create(
      wa.session,
      (base64Qr, asciiQR, attempts, urlCode) => {
        var matches = base64Qr.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
          response = {};

        if (matches.length !== 3) {
          return new Error("Invalid input string");
        }
        response.type = matches[1];
        response.data = new Buffer.from(matches[2], "base64");

        var imageBuffer = response;
        require("fs").writeFile(path.join(__dirname, "../public/img", "qr.png"), imageBuffer["data"], "binary", function (err) {
          if (err != null) {
            console.log(err);
          } else {
            pusher.trigger("scanner", "qr", {
              id: wa.id,
              session: wa.session,
            });
          }
        });
      },
      undefined,
      { logQR: false }
    )
    .then((client) => {
      pusher.trigger("scanner", "scanning", {
        message: "Connected",
        id: wa.id,
        session: wa.session,
      });
      console.log(client);
    })
    .catch((erro) => {
      console.log(erro);
    });

  res.json({
    success: true,
    data: wa,
  });
});

module.exports = router;
