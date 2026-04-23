import { useEventListener } from "usehooks-ts";
import { MediaLayer } from "./layers/MediaLayer";
import { ScrollerLayer } from "./layers/ScrollerLayer";
import { UiLayer } from "./layers/UiLayer";
import { CarouselItem } from "./store/types";
import { useFastCarousel } from "./store/useFastCarousel";

const data: CarouselItem[] = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  title: `Item ${i + 1}`,
  alt: `Alt ${i + 1}`,
  description:
    i % 2 === 0
      ? `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
      eiusmod tempor incididunt ut labore et dolore magna aliqua.`
      : `Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
      nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
      reprehenderit in voluptate velit esse`,
  buttonText: i % 2 === 0 ? "Read more" : "Watch now",
  thumbnail: `https://picsum.photos/id/${i + 10}/640/480`,
  cover: `https://picsum.photos/id/${i + 10}/1920/1080`,
}));

const scrollerItems = data.map((item) => ({
  id: String(item.id),
  src: item.thumbnail,
}));

const coverSources = data.map((item) => ({
  src: item.cover,
  alt: item.alt,
}));

function FastCarousel() {
  const scrollerIndex = useFastCarousel((state) => state.scrollerIndex);
  const coverIndex = useFastCarousel((state) => state.coverIndex);
  const activeItem = data[coverIndex];

  const handleChangeIndex = (index: number) => {
    const maxIndex = data.length - 1;
    const boundedTargetIndex = Math.max(0, Math.min(maxIndex, index));
    useFastCarousel.getState().changeIndex(boundedTargetIndex);
  };

  useEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) {
      return;
    }
    const direction = event.key === "ArrowLeft" ? "left" : "right";
    const index = direction === "left" ? scrollerIndex - 1 : scrollerIndex + 1;
    handleChangeIndex(index);
  });

  return (
    <div className="relative w-screen aspect-video overflow-hidden flex flex-col">
      {/* Media Layer */}
      <MediaLayer images={coverSources} />

      {/* Static overlay (NEVER changes) */}
      <div className="absolute w-full aspect-video bg-gradient-to-t from-black to-70% to-transparent z-10 pointer-events-none" />

      {/* UI Layer */}
      <UiLayer
        title={activeItem.title}
        buttonText={activeItem.buttonText}
        description={activeItem.description}
      />

      {/* Horizontal list with thumbnails */}
      <ScrollerLayer items={scrollerItems} />
    </div>
  );
}

export default FastCarousel;
