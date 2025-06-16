import { v4 as uuid } from "uuid";
import io from "socket.io-client";
import { hidePluginWindow } from "./utils";

let videoTransferFileName: string | undefined;
//MediaRecorder- part of the Web Media Recording API—it’s a built‑in browser (and Electron renderer) interface
//for capturing mediastreams (e.g., screen capture or webcam) and turning them into blobs you can save or upload.
let mediaRecorder: MediaRecorder | undefined;
let userId: string;

const socket = io(import.meta.env.VITE_SOCKET_URL as string);

export const StartRecording = (onSources: {
  id: string;
  screen: string;
  audio: string;
}) => {
  if (!mediaRecorder) {
    throw new Error("MediaRecorder not initialized");
  }
  hidePluginWindow(true);
  videoTransferFileName = `${uuid()}-${onSources?.id.slice(0, 8)}.webm`;
  mediaRecorder.start(1000);
};
// .start(timeslice?: number) - start recording
//.start()-no  parameter- record continuously until  call .stop(), and then fire a single dataavailable event with all the recorded data.
// Passing a timeslice (in milliseconds)— 1000—tells the recorder to emit a dataavailable event every 1000 ms (i.e., every second).

export const onStopRecording = () => {
  hidePluginWindow(false);
  if (mediaRecorder) {
    mediaRecorder.stop(); //calls stopRecording - callback given in selectsources
  }
};
const stopRecording = () => {
  hidePluginWindow(false);
  socket.emit("process-video", {
    filename: videoTransferFileName,
    userId,
  });
};

export const onDataAvailable = (e: BlobEvent) => {
  socket.emit("video-chunks", {
    chunks: e.data,
    filename: videoTransferFileName,
  });
};

export const selectSources = async (
  onSources: {
    id: string;
    screen: string;
    audio: string;
    preset: "HD" | "SD";
  },
  videoElement: React.RefObject<HTMLVideoElement>
) => {
  if (onSources && onSources.id && onSources.screen && onSources.audio) {
    const constraints: any = {
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: onSources.screen,
          // width: onSources.preset === "HD" ? 1920 : 1280,
          // height: onSources.preset === "HD" ? 1080 : 720,
          minWidth: onSources.preset === "HD" ? 1920 : 1280,
          maxWidth: onSources.preset === "HD" ? 1920 : 1280,
          minHeight: onSources.preset === "HD" ? 1080 : 720,
          maxHeight: onSources.preset === "HD" ? 1080 : 720,
          frameRate: 30,
        },
      },
    };

    userId = onSources.id;

    // getUserMedia- API in browser/Electron‑renderer gateway to get live audio and video streams
    //takes-mediaconstraints - returns MediaStream
    //MediaStream- like a container for live media data — it holds video and/or audio tracks.

    try {
      // Creating the stream
      //1. Screen stream: asking the browser/Electron for the desktop video
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      //2. audio stream-asking for the specific microphone
      const audioStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: onSources?.audio
          ? { deviceId: { exact: onSources.audio } }
          : false,
      });
      //3.Preview: show the desktop(screen) stream in <video> element
      if (videoElement && videoElement.current) {
        videoElement.current.srcObject = stream;
        videoElement.current.muted = true;
        await videoElement.current.play();
      }
      // (window as any).previewStream = stream;
      //4.Combining both streams into one MediaStream
      const combinedStream = new MediaStream([
        ...stream.getTracks(),
        ...audioStream.getTracks(),
      ]);

      //5. Initializing --the recorder on the merged stream
      mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: "video/webm; codecs=vp9",
      });

      //6.event handlers for data and stop
      mediaRecorder.ondataavailable = onDataAvailable; // called with each chunk
      mediaRecorder.onstop = stopRecording; // called when recording stops
    } catch (error) {
      // Handle any permission or device errors
      console.error(error);
    }
  }
};
