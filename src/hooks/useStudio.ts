import { mediaSchema } from "@/schema/mediaSchema";
import useZodForm from "./useZodForm";
import { useMutation } from "@tanstack/react-query";
import { updateMediaSettings } from "@/lib/utils";
import { toast } from "sonner";
import { useEffect } from "react";

export const useStudio = (
  id: string,
  preset: "HD" | "SD"| undefined,
  audio: string|null,
  screen: string|null
) => {
    console.log(id)
  const { register, watch } = useZodForm(mediaSchema, {
    audio: audio,
    screen: screen,
    preset: preset,
  });

  const {isPending,mutate} = useMutation({
    mutationKey: ["media-sources"],
    mutationFn: (data: {
      screen: string,
      audio: string,
      preset: "HD" | "SD",
      id:string
    }) => updateMediaSettings(data.screen,data.audio, data.preset, id),
    onSuccess:(data)=>{
        toast(data?.status===200? "Success":"Error",{description:data?.data})
    }
  });
  useEffect(()=>{
    if(audio && screen){
        window.ipcRenderer.send("media-sources",{
            screen,
            audio,
            preset,
            id:id
        })
    }
  },[audio,screen])

  useEffect(()=>{
    const subscribe=watch((values)=>{
        mutate({
            screen:values.screen,
            audio:values.audio,
            preset:values.preset,
            id:id
        })
        window.ipcRenderer.send("media-sources",{
            screen:values.screen,
            audio:values.audio,
            preset:values.preset,
            id:id
        })
    })
    return ()=>subscribe.unsubscribe()
  },[watch])

  return{
    isPending,
    register
  }
};
