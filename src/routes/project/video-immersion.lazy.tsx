import { createLazyFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import ModalVideo from "../../components/VideoImmersion/ModalVideo";
import VideoEmbedded from "../../components/VideoImmersion/VideoEmbedded";

export const Route = createLazyFileRoute("/project/video-immersion")({
  component: VideoImmersion,
});

function VideoImmersion() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [videoContainer, setVideoContainer] = useState(1);

  // Data-driven card list: id -> which videoId to render in that slot
  const cards = [
    { id: 1, videoId: "videoId1" },
    { id: 2, videoId: "videoId1" },
    { id: 3, videoId: "videoId2" },
    { id: 4, videoId: "videoId2" },
    { id: 5, videoId: "videoId3" },
    { id: 6, videoId: "videoId3" },
    { id: 7, videoId: "videoId4" },
    { id: 8, videoId: "videoId4" },
    { id: 9, videoId: "videoId5" },
    { id: 10, videoId: "videoId5" },
    { id: 11, videoId: "videoId6" },
    { id: 12, videoId: "videoId6" },
  ];

  const handleRetrieve = useCallback((containerId: number) => {
    setVideoContainer(containerId);
  }, []);

  const handleOpenModal1 = useCallback(() => {
    setVideoContainer(0); // Clear from cards
    setOpen1(true);
  }, []);

  const handleOpenModal2 = useCallback(() => {
    setVideoContainer(0); // Clear from cards
    setOpen2(true);
  }, []);

  const handleCloseModal1 = useCallback(() => {
    setVideoContainer(1); // Move back to first card
    setOpen1(false);
  }, []);

  const handleCloseModal2 = useCallback(() => {
    setVideoContainer(3); // Move back to first card
    setOpen2(false);
  }, []);

  return (
    <main className="h-screen w-screen relative p-4">
      <h1 className="text-2xl font-bold z-10 mb-4">Video Immersion Example</h1>

      <div className="mb-4 gap-4 flex">
        <button
          onClick={handleOpenModal1}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Open Modal Video 1
        </button>

        <button
          onClick={handleOpenModal2}
          className="px-3 py-2 bg-blue-600 text-white rounded"
        >
          Open Modal Video 2
        </button>
      </div>

      {open1 && <ModalVideo onClose={handleCloseModal1} videoId="videoId1" />}
      {open2 && <ModalVideo onClose={handleCloseModal2} videoId="videoId2" />}

      <div className="flex flex-row flex-wrap gap-4">
        {cards.map((card) => (
          <div
            key={card.id}
            className="w-[45%] aspect-video bg-gray-200 rounded-lg shadow-lg overflow-clip flex items-center justify-center"
          >
            {videoContainer === card.id ? (
              <VideoEmbedded videoId={card.videoId} />
            ) : (
              <button
                className="px-3 py-2 bg-blue-600 text-white rounded"
                onClick={() => handleRetrieve(card.id)}
              >
                Retrieve {card.id}
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
