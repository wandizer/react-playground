import { createLazyFileRoute, Link } from "@tanstack/react-router";
import { SectionCard } from "../components/SectionCard/SectionCard";
import ImgReactVirtual from "../assets/tanstack-react-virtual.png";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

const LinkOverlay = (to: string) => (
  <Link to={to} className="absolute inset-x-0 inset-y-0 group">
    {/* Backdrop */}
    <div className="w-full h-full group-hover:backdrop-blur group-hover:bg-black/50" />
    {/* Content */}
    <div className="hidden group-hover:flex absolute inset-0 items-center justify-center">
      <h1 className="text-white text-2xl font-bold drop-shadow-2xl">
        Read more...
      </h1>
    </div>
  </Link>
);

function Index() {
  return (
    <main className="pt-20 m-4 gap-4 flex flex-wrap">
      <SectionCard
        img={{ src: ImgReactVirtual, alt: "react-virtual" }}
        title="Horizontal Virtual Slide"
        description="Example of a horizontal virtual slide using react-virtual from TanStack."
        tags={["react", "virtual", "horizontal"]}
        renderOverlay={() => LinkOverlay("/project/horizontal-virtual-slide")}
      />
      <SectionCard
        renderOverlay={() => LinkOverlay("/project/horizontal-virtual-slide")}
      />
      <SectionCard
        renderOverlay={() => LinkOverlay("/project/horizontal-virtual-slide")}
      />
    </main>
  );
}
