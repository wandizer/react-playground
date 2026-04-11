import { useEffect, useRef } from "react";
import { useVideo } from "./context/useVideo";

type VideoEmbeddedProps = {
  videoId: string;
  isActive?: boolean;
};

function VideoEmbedded({ videoId, isActive = true }: VideoEmbeddedProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { setContainer, setVideoId } = useVideo();

  useEffect(() => {
    if (!isActive) {
      return;
    }
    setContainer(ref.current);
    setVideoId(videoId); // Clear video when mounting
    return () => {
      // When this feature unmounts, release target
      setContainer(null);
    };
  }, [setContainer, setVideoId, videoId, isActive]);

  return <div ref={ref} className="w-full h-auto" />;
}

export default VideoEmbedded;
