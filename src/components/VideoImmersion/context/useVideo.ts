import { useContext } from "react";
import { VideoContext } from "./VideoProvider";

export function useVideo() {
  const ctx = useContext(VideoContext);
  if (!ctx) throw new Error("VideoContext missing in tree");
  return ctx;
}
