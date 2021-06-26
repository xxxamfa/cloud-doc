const { app, BrowserWindow } = require("electron");
// 判斷環境套件引用
const isDev = require("electron-is-dev");
let mainWindow;

app.on("ready", () => {
  // 主視窗start
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 680,
    webPreferences: {
      // 允許用node start
      nodeIntegration: true,
      contextIsolation: false,
      // 允許用node end
      // 允許使用remote
      enableRemoteModule: true,
    },
  });
  // 若為開發環境使用"http://localhost:3000" : 注意不是https是http.寫錯會開不了electron
  const urlLocation = isDev ? "http://localhost:3000/" : "先略過";
  mainWindow.loadURL(urlLocation);
  // 主視窗 end
});
