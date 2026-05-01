import { createLazyFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { VideoCard } from "../../components/VideoImmersion/VideoCard";

export const Route = createLazyFileRoute("/features/video-immersion")({
  component: VideoImmersion,
});

function VideoImmersion() {
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  return (
    <main className="h-screen w-screen relative p-4">
      <h1 className="text-2xl font-bold z-10 mb-4">Video Immersion Example</h1>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 3 }, (_, i) => {
          const videoId = `videoId${i}`;
          return (
            <VideoCard
              key={`video-card-${videoId}`}
              id={`video-card-${videoId}`}
              videoId={videoId}
              isActive={activeCardIndex === i}
              onClickActivate={() => setActiveCardIndex(i)}
            />
          );
        })}
      </div>
    </main>
  );
}
