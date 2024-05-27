const fs = require("fs");

const getFiles = function (dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    if (!file.includes(".js")) {
      continue;
    }
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      files.push(name);
    }
  }
  return files;
};

module.exports = getFiles;
