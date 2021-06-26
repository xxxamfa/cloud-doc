// 若在非純node,js環境使用要加上window.
const fs = window.require("fs").promises;
const path = window.require("path");
// 如此封裝目的是為讓code更好管理
const fileHelper = {
  readFile: (path) => {
    return fs.readFile(path, { encoding: "utf8" });
  },
  writeFile: (path, content) => {
    return fs.writeFile(path, content, { encoding: "utf8" });
  },
  renameFile: (path, newPath) => {
    return fs.rename(path, newPath);
  },
  deleteFile: (path) => {
    return fs.unlink(path);
  },
};

export default fileHelper;
