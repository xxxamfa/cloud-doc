const fs = require("fs").promises;
const path = require("path");
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

const testPath = path.join(__dirname, "helper.js");
// 新檔案產生路徑
const testWritePath = path.join(__dirname, "hello.md");
const renamePath = path.join(__dirname, "rename.md");
// fileHelper.readFile(testPath).then((data) => {
//   console.log("data", data);
// });
// fileHelper.writeFile(testWritePath, "## hello world").then(() => {
//   console.log("寫入成功");
// });
// fileHelper.renameFile(testWritePath, renamePath).then(() => {
//   console.log("重新命名成功");
// });
fileHelper.deleteFile(renamePath).then(() => {
  console.log(`${renamePath} 刪除成功`);
});
