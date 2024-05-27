const express = require("express");

const registerController = function (controller, path = "/", router = express.Router()) {
  if (Array.isArray(controller)) {
    controller.forEach((c) => {
      registerController(c, path, router);
    });
    return router;
  }

  let absPath = "/" + path.replace(/^\/|\/$/g, "");
  if (absPath != "/") absPath = absPath + "/";

  _.forOwn(controller, (f, m) => {
    const uri = Case.kebab(m).split("-");
    const lastUri = [...uri].pop();
    switch (lastUri) {
      case "action":
        uri.pop();
        router.post(absPath + uri.join("-"), f);
        break;
      case "put":
        uri.pop();
        router.put(absPath + uri.join("-"), f);
        break;
      case "patch":
        uri.pop();
        router.patch(absPath + uri.join("-"), f);
        break;
      case "delete":
        uri.pop();
        router.delete(absPath + uri.join("-"), f);
        break;
      default:
        router.get(absPath + uri.join("-"), f);
        break;
    }
  });

  return router;
};

module.exports = registerController;
