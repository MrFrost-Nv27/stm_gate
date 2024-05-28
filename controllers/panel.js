const passport = require("passport");

module.exports = {
  whatsapp: (req, res) => {
    res.render("panel/whatsapp", {
      page: "whatsapp",
    });
  },
};
