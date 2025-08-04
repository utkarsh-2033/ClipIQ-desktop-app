import { app, ipcMain, desktopCapturer, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
app.commandLine.appendSwitch("log-level", "3");
const PROD_UI = "https://utkarsh-2033.github.io/ClipIQ-desktop-app/";
let win;
let studioWin;
let webcamWin;
function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 400,
    minHeight: 400,
    minWidth: 300,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: true,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  studioWin = new BrowserWindow({
    width: 300,
    height: 300,
    minHeight: 50,
    maxHeight: 400,
    minWidth: 300,
    maxWidth: 400,
    // hasShadow: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: true,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  webcamWin = new BrowserWindow({
    width: 200,
    height: 200,
    minHeight: 70,
    maxHeight: 400,
    minWidth: 70,
    maxWidth: 400,
    // hasShadow: false,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: true,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, "screen-saver", 1);
  studioWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  studioWin.setAlwaysOnTop(true, "screen-saver", 1);
  webcamWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  webcamWin.setAlwaysOnTop(true, "screen-saver", 1);
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  studioWin.webContents.on("did-finish-load", () => {
    studioWin == null ? void 0 : studioWin.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  });
  webcamWin.webContents.on("did-finish-load", () => {
    webcamWin == null ? void 0 : webcamWin.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    studioWin.loadURL(`${VITE_DEV_SERVER_URL}/studio.html`);
    webcamWin.loadURL(`${VITE_DEV_SERVER_URL}/webcam.html`);
  } else {
    win.loadURL(`${PROD_UI}/`);
    studioWin.loadURL(`${PROD_UI}/studio.html`);
    webcamWin.loadURL(`${PROD_UI}/webcam.html`);
  }
  win.webContents.openDevTools();
  win.webContents.on("did-fail-load", (errorDescription) => {
    console.error("Page failed to load:", errorDescription);
  });
  win.webContents.on("console-message", (level, message) => {
    console.log(`Console message: [${level}] ${message}`);
  });
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    studioWin = null;
    webcamWin = null;
  }
});
ipcMain.on("closeApp", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    studioWin = null;
    webcamWin = null;
  }
});
ipcMain.handle("getSources", async () => {
  const data = await desktopCapturer.getSources({
    thumbnailSize: { height: 100, width: 150 },
    fetchWindowIcons: true,
    types: ["window", "screen"]
  });
  return data;
});
ipcMain.on("media-sources", (_event, payload) => {
  studioWin == null ? void 0 : studioWin.webContents.send("profile-received", payload);
});
ipcMain.on("resize-studio", (_event, payload) => {
  if (payload.shrink) {
    studioWin == null ? void 0 : studioWin.setSize(400, 100);
  }
  if (!payload.shrink) {
    studioWin == null ? void 0 : studioWin.setSize(400, 250);
  }
});
ipcMain.on("hide-plugin", (event, payload) => {
  console.log(event, "-------------------");
  win == null ? void 0 : win.webContents.send("hide-plugin", payload);
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
