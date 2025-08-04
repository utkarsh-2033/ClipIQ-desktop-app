import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const onCloseApp = () => window.ipcRenderer.send("closeApp");

const httpsClient = axios.create({
  baseURL: import.meta.env.VITE_HOST_URL,
});

export const fetchUserdata = async (clerkId: string) => {
  const response = await httpsClient.get(`/auth/${clerkId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(response);
  return response.data;
};

export const getMediaSources = async () => {
  // in an Electron renderer process, where ipcRenderer is used to communicate asynchronously with
  // the main process. The "getSources" channel likely triggers the main process to return a list of available display sources
  const displays = await window.ipcRenderer.invoke("getSources");

  //Web Media API - to get list of all available media input and output devies-audio,camera
  const enumerateDevices = await navigator.mediaDevices.enumerateDevices();

  // filters this list to include only devices where device.kind is "audioinput", which corresponds to microphones.
  const audioInput = enumerateDevices.filter(
    (device) => device.kind === "audioinput"
  );
  console.log("getting");
  return { displays, audio: audioInput };
};

export const updateMediaSettings = async (
  screen: string,
  audio: string,
  preset: "HD" | "SD",
  id: string
) => {
  console.log(id);
  console.log("----------------------");
  console.log("----------------------");
  console.log("----------------------");
  const response = await httpsClient.post(
    `/studio/${id}`,
    { screen, audio, preset },
    {
      headers: {
        "Content-Type": "application/json",
      }
    }
  );
  console.log(response);
  return response.data;
};

export const hidePluginWindow = (state: boolean) => {
  window.ipcRenderer.send("hide-plugin", { state });
};

export const videoRecordingTime = (ms: number) => {
  const second = Math.floor((ms / 1000) % 60)
    .toString()
    .padStart(2, "0");
  const minute = Math.floor((ms / 1000 / 60) % 60)
    .toString()
    .padStart(2, "0");
  const hour = Math.floor((ms / 1000 / 60 / 60) % 60)
    .toString()
    .padStart(2, "0");
  return { length: `${hour}:${minute}:${second}`, minute };
};

export const resizeWindow = (shrink: boolean) => {
  window.ipcRenderer.send("resize-studio", { shrink });
};

export function isElectron() {
  return navigator.userAgent.toLowerCase().includes('electron');
}
