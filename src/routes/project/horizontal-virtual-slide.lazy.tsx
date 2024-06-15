import { createLazyFileRoute } from "@tanstack/react-router";
import { useVirtualizer } from "@tanstack/react-virtual";
import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";

export const Route = createLazyFileRoute("/project/horizontal-virtual-slide")({
  component: HorizontalVirtualSlide,
});

/**
 * Helper function to get the current index from a range. Usually the middle index of the range.
 * @param startIndex - The start index of the range that is currently visible.
 * @param endIndex - The end index of the range that is currently visible.
 * @returns The current index from the range.
 * @example
 *  getCurrentIndexFromRange({ startIndex: 0, endIndex: 2 }) // 1 // Middle index
 *  getCurrentIndexFromRange({ startIndex: 0, endIndex: 1 }) // 0 // No previous index
 *  getCurrentIndexFromRange({ startIndex: 1, endIndex: 2 }) // 2 // No next index
 */
const getCurrentIndexFromRange = (
  range: { startIndex: number; endIndex: number } | null,
): number => {
  const { startIndex, endIndex } = range || { startIndex: 0, endIndex: 0 };
  const diff = endIndex - startIndex;
  // Middle index
  if (diff === 2) {
    return startIndex + 1;
  }
  // No next index
  if (diff === 1 && startIndex !== 0) {
    return endIndex;
  }
  // No previous index
  return startIndex;
};

function HorizontalVirtualSlide() {
  const [currentIndex, setCurrentIndex] = useState(0);
  // const currentIndex = useRef(0);
  const parentRef = useRef<HTMLDivElement>(null);
  const length = 50;
  const paddingX = 100; // in px
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === length - 1;

  const columnVirtualizer = useVirtualizer({
    horizontal: true,
    count: length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => window.innerWidth - 200,
    overscan: 3,
    paddingStart: paddingX,
    paddingEnd: paddingX,
    scrollPaddingStart: paddingX,
    scrollPaddingEnd: paddingX,
    onChange(instance) {
      // Update the current index on scroll
      const alignedIndex = getCurrentIndexFromRange(instance.range);
      setCurrentIndex(alignedIndex);
    },
  });

  // Recalculate column widths on window resize
  useEffect(() => {
    const recalculateColumnWidths = () => columnVirtualizer.measure();
    window.addEventListener("resize", recalculateColumnWidths);
    return () => window.removeEventListener("resize", recalculateColumnWidths);
  }, [columnVirtualizer]);

  const handleSmoothScroll = useCallback(
    (index: number) => {
      columnVirtualizer.scrollToIndex(index, {
        behavior: "smooth",
      });
    },
    [columnVirtualizer],
  );

  const handlePrev = () => {
    if (currentIndex > 0) {
      handleSmoothScroll(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < length - 1) {
      handleSmoothScroll(currentIndex + 1);
    }
  };

  return (
    <main className="pt-16">
      <h1 className="text-3xl font-bold text-center mt-2">
        Horizontal Virtual Slide
      </h1>
      <div className="absolute top-0 bottom-0 h-screen flex flex-col justify-center z-0">
        {/* Previous button */}
        {!isFirst && (
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white text-xl p-4 bg-zinc-700 z-10"
          >
            ◀️
          </button>
        )}

        {/* Horizontal Virtual Slide */}
        <div
          ref={parentRef}
          // * scroll-px-[100px] = paddingX
          className="snap-x snap-always snap-mandatory scroll-px-[100px] overflow-x-auto no-scrollbar w-screen aspect-video"
        >
          <div
            className="relative h-full"
            style={{
              width: `${columnVirtualizer.getTotalSize()}px`,
            }}
          >
            {columnVirtualizer.getVirtualItems().map((virtualColumn) => {
              const isCurrent = virtualColumn.index === currentIndex;

              return (
                <div
                  key={virtualColumn.index}
                  className={"h-full absolute top-0 left-0 snap-center"}
                  style={{
                    width: `${virtualColumn.size}px`,
                    transform: `translateX(${virtualColumn.start}px)`,
                  }}
                  {...(!isCurrent && { "aria-hidden": true, inert: "true" })}
                >
                  {/* Cover */}
                  <div
                    tabIndex={0}
                    className={classNames(
                      "w-full h-full bg-black flex items-center justify-center text-white text-2xl font-bold",
                      {
                        "scale-90 aspect-video transform transition-all duration-500 ease-in-out":
                          !isCurrent,
                      },
                    )}
                  >
                    Column {virtualColumn.index}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next button */}
        {!isLast && (
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white text-xl p-4 bg-zinc-700 z-10"
          >
            ▶️
          </button>
        )}
      </div>
    </main>
  );
}
