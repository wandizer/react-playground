import { createLazyFileRoute } from "@tanstack/react-router";
import classNames from "classnames";
import { useEffect } from "react";
import { drawDynamicCurvedArrow } from "../../helpers/cubic-bezier-arrows";

export const Route = createLazyFileRoute("/project/cubic-bezier-arrows")({
  component: CubicBezierArrows,
});

const BaseSVG = (
  <svg
    id="arrowSvg"
    className="absolute inset-0 pointer-events-none overflow-visible"
  >
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="10"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 10 3.5, 0 7" fill="black" />
      </marker>
    </defs>
  </svg>
);

function Box({
  id,
  top = 0,
  left = 0,
  label,
}: {
  id: string;
  top?: number;
  left?: number;
  label?: string;
}) {
  return (
    <div
      id={id}
      style={{ top, left }}
      className={classNames(
        "w-32 h-32 bg-primary absolute rounded-lg",
        "bg-gradient-to-r from-blue-500 to-purple-500",
        "p-2 text-white",
      )}
    >
      <span className="z-10">{label}</span>
    </div>
  );
}

function CubicBezierArrows() {
  useEffect(() => {
    drawDynamicCurvedArrow("#box1", "#box2", undefined, "vertical", "Top");
    drawDynamicCurvedArrow("#box1", "#box3", undefined, "horizontal", "Right");
    drawDynamicCurvedArrow("#box1", "#box4", undefined, "vertical", "Bottom");
    drawDynamicCurvedArrow("#box1", "#box5", undefined, "horizontal", "Left");
    return () => {
      // Cleanup paths and text elements
      const svg = document.getElementById("arrowSvg");
      if (!svg) return;
      const paths = svg.querySelectorAll("path");
      const texts = svg.querySelectorAll("text");
      paths.forEach((path) => path.remove());
      texts.forEach((text) => text.remove());
      const rects = svg.querySelectorAll("rect");
      rects.forEach((rect) => rect.remove());
    };
  }, []);

  return (
    <>
      <main className="h-screen w-screen relative">
        <Box id="box1" label="Current" top={250} left={300} />
        <Box id="box2" label="Top" top={50} left={275} />
        <Box id="box3" label="Right" top={150} left={600} />
        <Box id="box4" label="Bottom" top={500} left={350} />
        <Box id="box5" label="Left" top={300} left={50} />
      </main>
      {BaseSVG}
    </>
  );
}
