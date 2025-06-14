import { getMediaSources } from "@/lib/utils";
import { useReducer } from "react";

export type SourceDeviceStateProps = {
  displays?: {
    appIcons: null;
    display: null;
    displayId: string;
    id: string;
    name: string;
    thumbnail: unknown[];
  }[];
  audioInput?: {
    deviceId: string;
    kind: string;
    label: string;
    groupId: string;
  }[];
  error?: string | null;
  isPending: boolean;
};
type DisplayDeviceActionProps = {
  type: "GET_DEVICES";
  payload: SourceDeviceStateProps;
};

const initialState = {
  displays: [],
  audioInput: [],
  error: null,
  isPending: false,
};

const reducer = (
  state: SourceDeviceStateProps,
  action: DisplayDeviceActionProps
) => {
  switch (action.type) {
    case "GET_DEVICES":
        // Merge new data into state
      return { ...state, ...action.payload };
    default:
      return state;
  }
};
export const useMediaResources = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchMediaResources = () => {
    // Indicate loading started
    dispatch({ type: "GET_DEVICES", payload: { isPending: true } });
    getMediaSources()
      .then((sources) => {
        // On success, update displays + audioInput + clear loading
        dispatch({
          type: "GET_DEVICES",
          payload: {
            displays: sources.displays,
            audioInput: sources.audio,
            isPending: false,
          },
        });
      })
      .catch((error) => {
        console.error("Failed to fetch media sources:", error);
        // On error, set the error message + clear loading
        dispatch({
          type: "GET_DEVICES",
          payload: { error: error.message, isPending: false },
        });
      });
  };

  return { state, fetchMediaResources };

};
