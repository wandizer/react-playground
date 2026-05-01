import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import ImgCubicBezierArrows from "../assets/cubic-bezier-arrows.png";
import ImgFastCarousel from "../assets/fast-carousel.png";
import ImgReactVirtual from "../assets/tanstack-react-virtual.png";
import ImgVideoImmersion from "../assets/video-immersion.png";
import { SectionCard } from "../components/SectionCard/SectionCard";
import { Container } from "../components/Ui/Container.tsx";

export const Route = createLazyFileRoute("/features")({
  component: Features,
});

const LinkOverlay = (to: string, msg = "Read more...") => (
  <Link to={to} className="absolute inset-x-0 inset-y-0 group">
    {/* Backdrop */}
    <div className="w-full h-full group-hover:backdrop-blur group-hover:bg-black/50" />
    {/* Content */}
    <div className="hidden group-hover:flex absolute inset-0 items-center justify-center">
      <h1 className="text-white text-2xl font-bold drop-shadow-2xl text-center">
        {msg}
      </h1>
    </div>
  </Link>
);

function Features() {
  const navigate = useNavigate();

  return (
    <Container>
      <div className="my-12 space-y-2 text-center">
        <h2 className="text-3xl font-bold text-gray-800 md:text-4xl dark:text-white">
          Features
        </h2>
        <p className="lg:mx-auto lg:w-6/12 text-gray-600 dark:text-gray-300">
          A collection of cool features and experiments built with React.
          Explore the projects below to see what I've been working on and feel
          free to check the code.
        </p>
      </div>

      <main className="m-4 gap-4 flex flex-wrap relative">
        <SectionCard
          img={{ src: ImgReactVirtual, alt: "react-virtual" }}
          title="Horizontal Virtual Slide"
          description="Example of a horizontal virtual slide using react-virtual from TanStack."
          tags={["react", "virtual", "horizontal"]}
          onClick={() => navigate({ to: "/features/horizontal-virtual-slide" })}
        />
        <SectionCard
          img={{ src: ImgCubicBezierArrows, alt: "cubic-bezier-arrows" }}
          title="Cubic Bezier Arrows"
          description="Example of cubic bezier arrows using SVG."
          tags={["svg", "cubic-bezier", "arrows", "spatial-navigation"]}
          onClick={() => navigate({ to: "/features/cubic-bezier-arrows" })}
        />
        <SectionCard
          title="Dynamic Modal"
          description="Example of a dynamic modal using headlessui/react."
          tags={["headlessui", "modal", "dynamic"]}
          renderOverlay={() => LinkOverlay("/features/dynamic-modal")}
        />
        <SectionCard
          img={{ src: ImgVideoImmersion, alt: "video-immersion" }}
          title="Video immersion"
          description="Example video immersion inside the app, where the video can be moved freely
         between different containers while keeping the playback state intact."
          tags={["video", "portal", "immersion"]}
          onClick={() => navigate({ to: "/features/video-immersion" })}
        />
        <SectionCard
          img={{ src: ImgFastCarousel, alt: "fast-carousel" }}
          title="Fast Carousel"
          description="Example of a fast carousel using a custom crossfade technique."
          tags={["carousel", "cross-fade", "animation", "performance"]}
          onClick={() => navigate({ to: "/features/fast-carousel" })}
        />
        <SectionCard
          // img={{ src: ImgFastCarousel, alt: "fast-carousel" }}
          title="Trello API"
          description="Workspace for testing the Trello API and building Trello-related projects."
          tags={["trello", "api", "workspace"]}
          onClick={() => navigate({ to: "/features/trello-api" })}
        />
        <SectionCard
          renderOverlay={() => (
            <div className="absolute inset-x-0 inset-y-0 group">
              {/* Backdrop */}
              <div className="w-full h-full group-hover:backdrop-blur group-hover:bg-black/50" />
              {/* Content */}
              <div className="hidden group-hover:flex absolute inset-0 items-center justify-center">
                <h1 className="text-white text-2xl font-bold drop-shadow-2xl text-center">
                  Add a new project by adding a new file in the routes folder.
                </h1>
              </div>
            </div>
          )}
        />
      </main>
    </Container>
  );
}
