import { create } from "zustand";

import { devtools } from "zustand/middleware";
import { TimeoutRef } from "./types";

export const TRANSITION_DURATION = 500;

type FastCarouselState = {
  itemCount: number;
  coverIndex: number;
  scrollerIndex: number;
  isCoverReady: boolean;
  isTransitioning: boolean;
};

type FastCarouselActions = {
  changeIndex: (index: number) => void;
  setIsCoverReady: (isReady: boolean) => void;
};

type FastCarouselStore = FastCarouselState & FastCarouselActions;

export const clearTimeoutRef = (timeoutRef: { current: TimeoutRef }) => {
  if (!timeoutRef.current) {
    return;
  }
  clearTimeout(timeoutRef.current);
  timeoutRef.current = undefined;
};

const timeOutSetCoverIndexRef: { current: TimeoutRef } = { current: undefined };

export const useFastCarousel = create<FastCarouselStore>()(
  devtools(
    (set, get) => {
      return {
        // Initial state
        itemCount: 0,
        coverIndex: 0,
        scrollerIndex: 0,
        isTransitioning: false,
        isCoverReady: false,
        // Actions
        changeIndex: (index: number) => {
          // Do nothing if index is the same as current
          if (index === get().scrollerIndex && index === get().coverIndex) {
            return;
          }

          // Clear any pending cover transition timeouts
          clearTimeoutRef(timeOutSetCoverIndexRef);

          set({
            scrollerIndex: index,
            isTransitioning: true,
            isCoverReady: false,
          });

          // TODO... handle transition phases and timers here to handle coverIndex

          timeOutSetCoverIndexRef.current = setTimeout(() => {
            set({ coverIndex: index, isTransitioning: false });
          }, TRANSITION_DURATION);
        },

        setIsCoverReady: (isReady: boolean) => set({ isCoverReady: isReady }),
      };
    },
    {
      name: "FastCarouselStore",
      serialize: {
        options: {
          // Avoid serializing functions and complex objects in devtools
          skip: (_key: unknown, value: unknown) =>
            typeof value === "function" || typeof value === "object",
        },
      },
    },
  ),
);
