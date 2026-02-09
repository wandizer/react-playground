import { useContext } from "react";
import { VideoPortalContext } from "./VideoPortal";

export function useVideoPortal() {
  const ctx = useContext(VideoPortalContext);
  if (!ctx) throw new Error("VideoPortal missing in tree");
  return ctx;
}
