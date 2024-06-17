import { createLazyFileRoute } from "@tanstack/react-router";
import { useVirtualizer, Virtualizer } from "@tanstack/react-virtual";
import classNames from "classnames";
import debounce from "lodash/debounce";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useWindowSize } from "usehooks-ts";

export const Route = createLazyFileRoute("/project/horizontal-virtual-slide")({
  component: HorizontalVirtualSlide,
});

/**
 * Helper function that shrinks width to maintain aspect ratio. Useful for responsive design.
 * @param aspectRatio - The aspect ratio of the element. E.g. "16:9"
 * @param width - The width of the element.
 * @returns The available width of the element, within the aspect ratio and container's height.
 */
const getMinRatioWidth = (
  aspectRatio: string = "16:9",
  container?: { innerHeight: number; innerWidth: number },
) => {
  const { innerHeight, innerWidth } = container || window;
  const [aspectWidth, aspectHeight] = aspectRatio.split(":").map(Number);
  const ratio = aspectWidth / aspectHeight;
  const maxWidth = innerHeight * ratio;
  return Math.min(maxWidth, innerWidth);
};

function HorizontalVirtualSlide() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);
  const length = 50; // Number of columns
  const minPadding = 100; // Minimum padding in px
  const bottomPadding = 112; // Bottom padding in px (also used for info height)
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === length - 1;

  const { width: windowWidth, height: windowHeight } = useWindowSize({
    debounceDelay: 250,
  });
  const isSmallScreen = windowWidth < 768;

  const estimatedSize = !isSmallScreen
    ? getMinRatioWidth(
        "16:9",
        parentRef.current
          ? {
              innerHeight: parentRef.current.clientHeight - bottomPadding,
              innerWidth: parentRef.current.clientWidth - minPadding * 2,
            }
          : undefined,
      )
    : (windowWidth * 9) / 16 + bottomPadding;

  const padding = useMemo(
    () => ((!isSmallScreen ? windowWidth : windowHeight) - estimatedSize) / 2,
    [estimatedSize, isSmallScreen, windowHeight, windowWidth],
  );

  // Debounced function to update current index
  const debouncedUpdateCurrentIndex = useMemo(() => {
    return debounce((instance: Virtualizer<HTMLDivElement, Element>) => {
      const { scrollOffset, measurementsCache } = instance;
      const [cachedFirstItem] = measurementsCache;
      const cachedItemSize = cachedFirstItem?.size;
      const estimatedIndex = Math.round(scrollOffset / cachedItemSize);
      setCurrentIndex((prevIndex) =>
        estimatedIndex !== prevIndex ? estimatedIndex : prevIndex,
      );
    }, 250);
  }, []);

  // Unmount cleanup of debounced function
  useEffect(() => {
    return debouncedUpdateCurrentIndex.cancel();
  }, [debouncedUpdateCurrentIndex]);

  const virtualizer = useVirtualizer({
    horizontal: !isSmallScreen,
    count: length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimatedSize,
    overscan: 5, // Sweet spot for quick swipe scroll
    paddingStart: isSmallScreen ? padding + bottomPadding / 2 : padding,
    paddingEnd: padding,
    scrollPaddingStart: padding,
    scrollPaddingEnd: padding,
    onChange: debouncedUpdateCurrentIndex,
  });

  useEffect(() => {
    const recalculateColumnWidths = () => virtualizer.measure();
    const debouncedResizeHandler = debounce(recalculateColumnWidths, 250);
    window.addEventListener("resize", debouncedResizeHandler);
    return () => window.removeEventListener("resize", debouncedResizeHandler);
  }, [virtualizer]);

  const handleSmoothScroll = useCallback(
    (index: number) => {
      virtualizer.scrollToIndex(index, { behavior: "auto" });
    },
    [virtualizer],
  );

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      handleSmoothScroll(currentIndex - 1);
    }
  }, [currentIndex, handleSmoothScroll]);

  const handleNext = useCallback(() => {
    if (currentIndex < length - 1) {
      handleSmoothScroll(currentIndex + 1);
    }
  }, [currentIndex, handleSmoothScroll]);

  return (
    <main className={classNames({ "pt-16": !isSmallScreen })}>
      <h1 className="text-3xl font-bold text-center py-2">
        Horizontal Virtual Slide
      </h1>
      <div
        className={classNames(
          "absolute top-0 bottom-0 flex flex-col justify-center z-0",
          {
            "mt-32 mb-8": !isSmallScreen,
          },
        )}
      >
        {/* Previous button */}
        {!isFirst && (
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white text-xl p-4 bg-zinc-700 z-10"
            style={{ marginTop: !isSmallScreen ? -(bottomPadding / 2) : 0 }}
          >
            ◀️
          </button>
        )}
        {/* Horizontal Virtual Slide */}
        <div
          ref={parentRef}
          id="scrollableElement"
          className={classNames(
            "snap-mandatory overflow-x-auto no-scrollbar w-screen h-full",
            {
              "snap-y overflow-y-auto": isSmallScreen,
              "snap-x overflow-x-auto": !isSmallScreen,
            },
          )}
        >
          <div
            className={classNames("relative", {
              "top-1/2 transform -translate-y-1/2": !isSmallScreen,
            })}
            style={
              !isSmallScreen
                ? {
                    height: `${(estimatedSize / 16) * 9 + bottomPadding}px`, // 80px for info
                    width: `${virtualizer.getTotalSize()}px`,
                  }
                : {
                    width: `100vw`,
                    height: `${virtualizer.getTotalSize() + bottomPadding}px`,
                  }
            }
          >
            {virtualizer.getVirtualItems().map((virtualItem) => {
              const isCurrent = virtualItem.index === currentIndex;

              return (
                <div
                  key={virtualItem.index}
                  className={classNames(
                    "absolute top-0 left-0 snap-center aspect-video",
                  )}
                  style={
                    !isSmallScreen
                      ? {
                          width: `${virtualItem.size}px`,
                          transform: `translateX(${virtualItem.start}px)`,
                        }
                      : {
                          width: `100%`,
                          transform: `translateY(${virtualItem.start}px)`,
                        }
                  }
                  {...(!isCurrent && { "aria-hidden": true, inert: "true" })}
                >
                  <div
                    className={classNames(
                      "w-full h-full transition-all duration-300 ease-in-out",
                      {
                        "scale-90 transform": !isCurrent && !isSmallScreen,
                        "opacity-70": !isCurrent && isSmallScreen,
                      },
                    )}
                  >
                    {/* Cover */}
                    <div
                      tabIndex={0}
                      className={classNames(
                        "w-full h-full bg-black flex items-center justify-center text-white text-2xl font-bold",
                      )}
                    >
                      Item {virtualItem.index}
                    </div>
                    {/* Info */}
                    <div className="max-h-20 flex flex-row flex-nowrap">
                      <div className="w-11/12">
                        <h2 className="text-2xl truncate">
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Voluptatibus., Lorem ipsum dolor sit amet,
                          consectetur adipisicing elit. Voluptatibus
                        </h2>
                        <p className="line-clamp-2">
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit. Voluptatibus. Lorem ipsum dolor sit amet,
                          consectetur adipisicing elit. Voluptatibus. Lorem
                          ipsum dolor sit amet, consectetur adipisicing elit.
                          Voluptatibus Lorem ipsum dolor sit amet, consectetur
                          adipisicing elit. VoluptatibusLorem ipsum dolor sit
                          amet, consectetur adipisicing elit. VoluptatibusLorem
                          ipsum dolor sit amet, consectetur adipisicing elit.
                          VoluptatibusLorem ipsum dolor sit amet, consectetur
                          adipisicing elit. VoluptatibusLorem ipsum dolor sit
                          amet, consectetur adipisicing elit. Voluptatibus
                        </p>
                      </div>
                      <div className="w-1/12 flex items-center justify-center">
                        <button
                          type="button"
                          className="w-12 h-12 rounded-full bg-black"
                        >
                          💟
                        </button>
                      </div>
                    </div>
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
            style={{ marginTop: !isSmallScreen ? -(bottomPadding / 2) : 0 }}
          >
            ▶️
          </button>
        )}
      </div>
    </main>
  );
}
