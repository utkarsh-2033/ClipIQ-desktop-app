import { app, BrowserWindow, desktopCapturer, ipcMain } from "electron";
// import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const require = createRequire(import.meta.url);
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

app.commandLine.appendSwitch("log-level", "3"); // Warn and above
const PROD_UI="https://utkarsh-2033.github.io/ClipIQ-desktop-app/";
let win: BrowserWindow | null;
let studioWin: BrowserWindow | null;
let webcamWin: BrowserWindow | null;

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
      preload: path.join(__dirname, "preload.mjs"),
    },
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
      preload: path.join(__dirname, "preload.mjs"),
    },
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
    studioWin.loadURL(`${VITE_DEV_SERVER_URL}/studio.html`);
    webcamWin.loadURL(`${VITE_DEV_SERVER_URL}/webcam.html`);
  }
  // win.loadFile('dist/index.html')
  else {
    win.loadURL(`${PROD_UI}/`);
    studioWin.loadURL(`${PROD_UI}/studio.html`);
    webcamWin.loadURL(`${PROD_UI}/webcam.html`);
  }
  win.webContents.openDevTools(); // 👈 add this

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Page failed to load:', errorDescription);
  });

  win.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`Console message: [${level}] ${message}`);
  });

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

//cross renderer communication via mainProcess
ipcMain.on("media-sources", (_event, payload) => {
  // console.log(event);
  studioWin?.webContents.send("profile-received", payload);
});

// browserWindowInstance.setSize(width: number, height: number[, animate: boolean])
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
ipcMain.on("resize-studio", (_event, payload) => {
  // console.log(event);
  if (payload.shrink) {
    studioWin?.setSize(400, 100);
  }
  if (!payload.shrink) {
    studioWin?.setSize(400, 250);
  }
});
ipcMain.on("hide-plugin", (event, payload) => {
  console.log(event, "-------------------");
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
