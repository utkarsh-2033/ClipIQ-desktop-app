import { app, BrowserWindow, desktopCapturer, ipcMain } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let studioWin: BrowserWindow | null;
let webcamWin: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 500,
    height: 600,
    minHeight: 600,
    minWidth: 300,
    hasShadow: false,
    // frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: true,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs"),
    },
  });
  studioWin = new BrowserWindow({
    width: 500,
    height: 600,
    minHeight: 600,
    minWidth: 300,
    hasShadow: false,
    // frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: true,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  webcamWin = new BrowserWindow({
    width: 500,
    height: 600,
    minHeight: 600,
    minWidth: 300,
    hasShadow: false,
    // frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: true,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, "screen-saver", 1);

  studioWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  studioWin.setAlwaysOnTop(true, "screen-saver", 1);

  webcamWin.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  webcamWin.setAlwaysOnTop(true, "screen-saver", 1);

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });
  studioWin.webContents.on("did-finish-load", () => {
    studioWin?.webContents.send(
      "main-process-message",
      new Date().toLocaleString()
    );
  });
  webcamWin.webContents.on("did-finish-load", () => {
    webcamWin?.webContents.send(
      "main-process-message",
      new Date().toLocaleString()
    );
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    studioWin.loadURL(`${import.meta.env.VITE_APP_URL}/studio.html`);
    webcamWin.loadURL(`${import.meta.env.VITE_APP_URL}/webcam.html`);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
    studioWin.loadFile(path.join(RENDERER_DIST, "studio.html"));
    webcamWin.loadFile(path.join(RENDERER_DIST, "webcam.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
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
    types: ["window", "screen"],
  });
  return data;
});
ipcMain.on("media-sources", (event, payload) => {
  // console.log(event);
  studioWin?.webContents.send("profile-received", payload);
});
ipcMain.on("resize-studio", (event, payload) => {
  // console.log(event);
  if (payload.shrink) {
    studioWin?.setSize(400, 100);
  }
  if (!payload.shrink) {
    studioWin?.setSize(400, 250);
  }
});
ipcMain.on("hide-plugin", (event, payload) => {
  // console.log(event);
  win?.webContents.send("hide-plugin", payload);
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
