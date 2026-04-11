import { useEffect, useRef } from "react";
import { TEST_VIDEOS } from "../constants";

/* Mock player by attaching a TEST_VIDEO */
const createPlayer = (videoId: string) => {
  return {
    attach(video: HTMLVideoElement) {
      // Retrieve only numeric ID
      const numberId = parseInt(videoId.replace("videoId", ""), 10);

      // Cycle through test videos based on numeric ID
      video.src = TEST_VIDEOS[numberId % TEST_VIDEOS.length].sources[0];
    },
  };
};

/** Component responsible for `<video>` media implementation */
function Video({ videoId }: { videoId: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  // Create player ONCE
  if (!playerRef.current) {
    playerRef.current = createPlayer(videoId);
  }

  // Attach only once
  useEffect(() => {
    const videoNode = videoRef.current;

    if (videoNode && playerRef.current) {
      playerRef.current.attach(videoRef.current);
    }
    return () => {
      if (videoNode) {
        videoNode.src = "";
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      controls
      width="100%"
      height="100%"
    />
  );
}

export default Video;
