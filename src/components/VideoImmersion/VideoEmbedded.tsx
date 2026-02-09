import { useEffect, useRef } from "react";
import { useVideoPortal } from "./useVideoPortal";

function VideoEmbedded({ videoId }: { videoId: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { setContainer, setVideoId } = useVideoPortal();

  useEffect(() => {
    setContainer(ref.current);
    setVideoId(videoId); // Clear video when mounting
    return () => {
      // When this feature unmounts, release target
      setContainer(null);
    };
  }, [setContainer, setVideoId, videoId]);

  return <div ref={ref} style={{ width: "100%", height: "auto" }} />;
}

export default VideoEmbedded;
