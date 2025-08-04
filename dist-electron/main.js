import { app as l, ipcMain as a, desktopCapturer as h, BrowserWindow as c } from "electron";
import { fileURLToPath as m } from "node:url";
import o from "node:path";
const d = o.dirname(m(import.meta.url));
process.env.APP_ROOT = o.join(d, "..");
const i = process.env.VITE_DEV_SERVER_URL, b = o.join(process.env.APP_ROOT, "dist-electron"), w = o.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = i ? o.join(process.env.APP_ROOT, "public") : w;
l.commandLine.appendSwitch("log-level", "3");
const p = "https://utkarsh-2033.github.io/ClipIQ-desktop-app/";
let n, e, t;
function u() {
  n = new c({
    width: 400,
    height: 400,
    minHeight: 400,
    minWidth: 300,
    frame: !1,
    transparent: !0,
    alwaysOnTop: !0,
    focusable: !0,
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      devTools: !0,
      preload: o.join(d, "preload.mjs")
    }
  }), e = new c({
    width: 300,
    height: 300,
    minHeight: 50,
    maxHeight: 400,
    minWidth: 300,
    maxWidth: 400,
    // hasShadow: false,
    frame: !1,
    transparent: !0,
    alwaysOnTop: !0,
    focusable: !0,
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      devTools: !0,
      preload: o.join(d, "preload.mjs")
    }
  }), t = new c({
    width: 200,
    height: 200,
    minHeight: 70,
    maxHeight: 400,
    minWidth: 70,
    maxWidth: 400,
    // hasShadow: false,
    frame: !1,
    transparent: !0,
    alwaysOnTop: !0,
    focusable: !0,
    icon: o.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      devTools: !0,
      preload: o.join(d, "preload.mjs")
    }
  }), n.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), n.setAlwaysOnTop(!0, "screen-saver", 1), e.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), e.setAlwaysOnTop(!0, "screen-saver", 1), t.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), t.setAlwaysOnTop(!0, "screen-saver", 1), n.webContents.on("did-finish-load", () => {
    n == null || n.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  }), t.webContents.on("did-finish-load", () => {
    t == null || t.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  }), i ? (n.loadURL(i), e.loadURL(`${i}/studio.html`), t.loadURL(`${i}/webcam.html`)) : (n.loadURL(`${p}/`), e.loadURL(`${p}/studio.html`), t.loadURL(`${p}/webcam.html`)), n.webContents.openDevTools(), n.webContents.on("did-fail-load", (s) => {
    console.error("Page failed to load:", s);
  }), n.webContents.on("console-message", (s, r) => {
    console.log(`Console message: [${s}] ${r}`);
  });
}
l.on("window-all-closed", () => {
  process.platform !== "darwin" && (l.quit(), n = null, e = null, t = null);
});
a.on("closeApp", () => {
  process.platform !== "darwin" && (l.quit(), n = null, e = null, t = null);
});
a.handle("getSources", async () => await h.getSources({
  thumbnailSize: { height: 100, width: 150 },
  fetchWindowIcons: !0,
  types: ["window", "screen"]
}));
a.on("media-sources", (s, r) => {
  e == null || e.webContents.send("profile-received", r);
});
a.on("resize-studio", (s, r) => {
  r.shrink && (e == null || e.setSize(400, 100)), r.shrink || e == null || e.setSize(400, 250);
});
a.on("hide-plugin", (s, r) => {
  console.log(s, "-------------------"), n == null || n.webContents.send("hide-plugin", r);
});
l.on("activate", () => {
  c.getAllWindows().length === 0 && u();
});
l.whenReady().then(u);
export {
  b as MAIN_DIST,
  w as RENDERER_DIST,
  i as VITE_DEV_SERVER_URL
};
