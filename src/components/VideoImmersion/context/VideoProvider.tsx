import { createContext, useEffect, useMemo, useRef, useState } from "react";
import Video from "./Video";

type Ctx = {
  setContainer: (el: HTMLElement | null) => void;
  setVideoId: (el: string | null) => void;
  videoId: string | null;
  container: HTMLElement | null;
};

export const VideoContext = createContext<Ctx | null>(null);

function VideoProvider({ children }: { children: React.ReactNode }) {
  const hiddenContainerRef = useRef<HTMLDivElement | null>(null);
  const floatingVideoRef = useRef<HTMLDivElement | null>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  const value = useMemo(
    () => ({ setContainer, setVideoId, container, videoId }),
    [setContainer, container, setVideoId, videoId],
  );

  // When a `container` is provided, physically move the floating video node into it, and
  // move it back to the hidden container when `container` is set to null.
  useEffect(() => {
    const floatingVideo = floatingVideoRef.current;
    const hiddenContainer = hiddenContainerRef.current;
    if (!floatingVideo || !hiddenContainer) return;

    if (container) {
      if (floatingVideo.parentElement !== container)
        container.appendChild(floatingVideo);
    } else {
      if (floatingVideo.parentElement !== hiddenContainer)
        hiddenContainer.appendChild(floatingVideo);
    }
  }, [container]);

  // Render the surface node directly from `videoId` so the new node is
  // produced during render when `videoId` changes (avoids a one-frame delay
  // caused by updating a ref inside an effect).
  const videoNode = videoId ? <Video key={videoId} videoId={videoId} /> : null;

  return (
    <VideoContext.Provider value={value}>
      {children}

      {/* Temporary holder of the video while waiting for a new container */}
      <div
        id="video-hidden-container"
        className="hidden"
        ref={hiddenContainerRef}
      />
      <div
        id="floating-video"
        className="w-full aspect-video bg-black"
        ref={floatingVideoRef}
      >
        {videoNode}
      </div>
    </VideoContext.Provider>
  );
}

export default VideoProvider;
