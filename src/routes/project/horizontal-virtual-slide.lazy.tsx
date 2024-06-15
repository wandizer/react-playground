import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/project/horizontal-virtual-slide")({
  component: HorizontalVirtualSlide,
});

function HorizontalVirtualSlide() {
  return <div className="py-4">HorizontalVirtualSlide Page</div>;
}
