import { useEffect, useRef } from "react";

/* Mock player — replace with hls.js / dash.js / etc */
const createPlayer = (videoId: string) => {
  return {
    attach(video: HTMLVideoElement) {
      // Stable public test sources
      // Google Cloud samples (reliable MP4s)
      const BIG_BUCK =
        "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      const ELEPHANTS =
        "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4";
      const JOYRIDES =
        "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";
      const MDN_FLOWER =
        "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
      const HLS_TEST =
        "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";
      const DASH_TEST = "https://dash.akamaized.net/akamai/bbb_30s/bbb_30s.mpd";

      switch (videoId) {
        case "videoId1":
          video.src = BIG_BUCK;
          break;
        case "videoId2":
          video.src = ELEPHANTS;
          break;
        case "videoId3":
          video.src = JOYRIDES;
          break;
        case "videoId4":
          video.src = MDN_FLOWER;
          break;
        case "videoId5":
          // HLS playlist: will require an HLS-capable player (hls.js) to play
          video.src = HLS_TEST;
          break;
        case "videoId6":
          // DASH manifest: will require a DASH-capable player (dash.js) to play
          video.src = DASH_TEST;
          break;
        default:
          video.src = BIG_BUCK;
      }
    },
  };
};

function VideoSurface({ videoId }: { videoId: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);

  // Create player ONCE
  if (!playerRef.current) {
    playerRef.current = createPlayer(videoId);
  }

  // Attach only once
  useEffect(() => {
    if (videoRef.current && playerRef.current) {
      playerRef.current.attach(videoRef.current);
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.src = "";
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
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
}

export default VideoSurface;
