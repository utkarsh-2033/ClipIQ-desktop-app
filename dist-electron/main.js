import { app as r, ipcMain as i, desktopCapturer as u, BrowserWindow as a } from "electron";
import { fileURLToPath as m } from "node:url";
import n from "node:path";
const c = n.dirname(m(import.meta.url));
process.env.APP_ROOT = n.join(c, "..");
const p = process.env.VITE_DEV_SERVER_URL, v = n.join(process.env.APP_ROOT, "dist-electron"), d = n.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = p ? n.join(process.env.APP_ROOT, "public") : d;
r.commandLine.appendSwitch("log-level", "3");
let t, e, o;
function h() {
  t = new a({
    width: 400,
    height: 400,
    minHeight: 400,
    minWidth: 300,
    // maxWidth: 600,
    // hasShadow: false,
    frame: !1,
    transparent: !0,
    // backgroundColor: '#00000000',
    alwaysOnTop: !0,
    focusable: !0,
    icon: n.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      devTools: !0,
      preload: n.join(c, "preload.mjs")
    }
  }), e = new a({
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
      preload: n.join(c, "preload.mjs")
    }
  }), o = new a({
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
      preload: n.join(c, "preload.mjs")
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
  }), p ? (t.loadURL(p), e.loadURL("http://localhost:5173/studio.html"), o.loadURL("http://localhost:5173/webcam.html")) : (t.loadFile(n.join(d, "index.html")), e.loadFile(n.join(d, "studio.html")), o.loadFile(n.join(d, "webcam.html")));
}
r.on("window-all-closed", () => {
  process.platform !== "darwin" && (r.quit(), t = null, e = null, o = null);
});
i.on("closeApp", () => {
  process.platform !== "darwin" && (r.quit(), t = null, e = null, o = null);
});
i.handle("getSources", async () => await u.getSources({
  thumbnailSize: { height: 100, width: 150 },
  fetchWindowIcons: !0,
  types: ["window", "screen"]
}));
i.on("media-sources", (l, s) => {
  e == null || e.webContents.send("profile-received", s);
});
i.on("resize-studio", (l, s) => {
  s.shrink && (e == null || e.setSize(400, 100)), s.shrink || e == null || e.setSize(400, 250);
});
i.on("hide-plugin", (l, s) => {
  console.log(l, "-------------------"), t == null || t.webContents.send("hide-plugin", s);
});
r.on("activate", () => {
  a.getAllWindows().length === 0 && h();
});
r.whenReady().then(h);
export {
  v as MAIN_DIST,
  d as RENDERER_DIST,
  p as VITE_DEV_SERVER_URL
};
