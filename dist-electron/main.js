import { app as r, ipcMain as l, desktopCapturer as m, BrowserWindow as c } from "electron";
import { fileURLToPath as h } from "node:url";
import n from "node:path";
const d = n.dirname(h(import.meta.url));
process.env.APP_ROOT = n.join(d, "..");
const i = process.env.VITE_DEV_SERVER_URL, v = n.join(process.env.APP_ROOT, "dist-electron"), p = n.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = i ? n.join(process.env.APP_ROOT, "public") : p;
r.commandLine.appendSwitch("log-level", "3");
let t, e, o;
function u() {
  t = new c({
    width: 400,
    height: 400,
    minHeight: 400,
    minWidth: 300,
    frame: !1,
    transparent: !0,
    alwaysOnTop: !0,
    focusable: !0,
    icon: n.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      devTools: !0,
      preload: n.join(d, "preload.mjs")
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
    icon: n.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      devTools: !0,
      preload: n.join(d, "preload.mjs")
    }
  }), o = new c({
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
    icon: n.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      devTools: !0,
      preload: n.join(d, "preload.mjs")
    }
  }), t.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), t.setAlwaysOnTop(!0, "screen-saver", 1), e.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), e.setAlwaysOnTop(!0, "screen-saver", 1), o.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), o.setAlwaysOnTop(!0, "screen-saver", 1), t.webContents.on("did-finish-load", () => {
    t == null || t.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  }), o.webContents.on("did-finish-load", () => {
    o == null || o.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  }), i ? (t.loadURL(i), e.loadURL(`${i}/studio.html`), o.loadURL(`${i}/webcam.html`)) : (t.loadFile(n.join(p, "index.html")), e.loadFile(n.join(p, "studio.html")), o.loadFile(n.join(p, "webcam.html")));
}
r.on("window-all-closed", () => {
  process.platform !== "darwin" && (r.quit(), t = null, e = null, o = null);
});
l.on("closeApp", () => {
  process.platform !== "darwin" && (r.quit(), t = null, e = null, o = null);
});
l.handle("getSources", async () => await m.getSources({
  thumbnailSize: { height: 100, width: 150 },
  fetchWindowIcons: !0,
  types: ["window", "screen"]
}));
l.on("media-sources", (a, s) => {
  e == null || e.webContents.send("profile-received", s);
});
l.on("resize-studio", (a, s) => {
  s.shrink && (e == null || e.setSize(400, 100)), s.shrink || e == null || e.setSize(400, 250);
});
l.on("hide-plugin", (a, s) => {
  console.log(a, "-------------------"), t == null || t.webContents.send("hide-plugin", s);
});
r.on("activate", () => {
  c.getAllWindows().length === 0 && u();
});
r.whenReady().then(u);
export {
  v as MAIN_DIST,
  p as RENDERER_DIST,
  i as VITE_DEV_SERVER_URL
};
