import { createContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import VideoSurface from "./VideoSurface";

type Ctx = {
  setContainer: (el: HTMLElement | null) => void;
  setVideoId: (el: string | null) => void;
  videoId: string | null;
  container: HTMLElement | null;
};

export const VideoPortalContext = createContext<Ctx | null>(null);

function VideoPortal({ children }: { children: React.ReactNode }) {
  const portalRef = useRef<HTMLDivElement | null>(null);
  const floatingVideoRef = useRef<HTMLDivElement | null>(null);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);

  // Render the surface node directly from `videoId` so the new node is
  // produced during render when `videoId` changes (avoids a one-frame delay
  // caused by updating a ref inside an effect).
  const videoSurfaceNode = videoId ? (
    <VideoSurface key={videoId} videoId={videoId} />
  ) : null;

  const value = useMemo(
    () => ({ setContainer, setVideoId, container, videoId }),
    [setContainer, container, setVideoId, videoId],
  );

  // When a `container` is provided, physically move the floating video node into it.
  // This avoids unmounting the React tree (and restarting the video) when the
  // visible host changes — we render the portal into `floatingVideoRef` and
  // append that node into the chosen `container`.
  useEffect(() => {
    const floatingVideo = floatingVideoRef.current;
    const portal = portalRef.current;
    if (!floatingVideo || !portal) return;

    if (container) {
      if (floatingVideo.parentElement !== container)
        container.appendChild(floatingVideo);
    } else {
      if (floatingVideo.parentElement !== portal)
        portal.appendChild(floatingVideo);
    }
  }, [container]);

  return (
    <VideoPortalContext.Provider value={value}>
      {children}

      <div ref={portalRef} style={{ display: "none" }} />
      <div
        id="floating-video"
        style={{ width: "100%", aspectRatio: "16 / 9", background: "black" }}
        ref={floatingVideoRef}
      />

      {floatingVideoRef.current &&
        videoSurfaceNode &&
        createPortal(videoSurfaceNode, floatingVideoRef.current)}
    </VideoPortalContext.Provider>
  );
}

export default VideoPortal;
