import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SectionCard } from "../components/SectionCard/SectionCard";
import ImgReactVirtual from "../assets/tanstack-react-virtual.png";
import ImgCubicBezierArrows from "../assets/cubic-bezier-arrows.png";

export const Route = createLazyFileRoute("/")({
  component: Index,
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

function Index() {
  const navigate = useNavigate();

  return (
    <main className="m-4 gap-4 flex flex-wrap">
      <SectionCard
        img={{ src: ImgReactVirtual, alt: "react-virtual" }}
        title="Horizontal Virtual Slide"
        description="Example of a horizontal virtual slide using react-virtual from TanStack."
        tags={["react", "virtual", "horizontal"]}
        onClick={() => navigate({ to: "/project/horizontal-virtual-slide" })}
      />
      <SectionCard
        img={{ src: ImgCubicBezierArrows, alt: "cubic-bezier-arrows" }}
        title="Cubic Bezier Arrows"
        description="Example of cubic bezier arrows using SVG."
        tags={["svg", "cubic-bezier", "arrows", "spatial-navigation"]}
        onClick={() => navigate({ to: "/project/cubic-bezier-arrows" })}
      />
      <SectionCard
        title="Dynamic Modal"
        description="Example of a dynamic modal using headlessui/react."
        tags={["headlessui", "modal", "dynamic"]}
        renderOverlay={() => LinkOverlay("/project/dynamic-modal")}
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
  );
}
