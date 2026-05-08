import { createStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { preloadImage } from './helper.ts'
import type { CarouselItem } from './types.ts'

const AUTO_ADVANCE_DURATION = 10_000

export type FastCarouselState = {
  indexActive: number
  indexDisplay: number
  items: CarouselItem[]
}

export type FastCarouselActions = {
  changeIndex: (index: number) => void
  incrementIndex: () => void
  decrementIndex: () => void
}

export type FastCarouselStore = FastCarouselState & FastCarouselActions

const INITIAL_STATE = {
  indexActive: 0,
  indexDisplay: 0,
  items: [],
}

export function createFastCarouselStore(
  initProps?: Partial<FastCarouselState>,
) {
  let requestIdCounter = 0 // helps cancel outdated async work
  let autoAdvanceTimeout: ReturnType<typeof setTimeout> | null = null
  let onLoadAnimationFrame: ReturnType<typeof requestAnimationFrame> | null =
    null

  return createStore<FastCarouselStore>()(
    devtools(
      (set, get, _api) => {
        const _clearPreviousComputing = () => {
          // Cancel previous animation frame
          if (onLoadAnimationFrame) {
            cancelAnimationFrame(onLoadAnimationFrame)
            onLoadAnimationFrame = null
          }
          // Cancel previous timeout
          if (autoAdvanceTimeout) {
            clearTimeout(autoAdvanceTimeout)
            autoAdvanceTimeout = null
          }
        }

        const _autoAdvance = (originalRequestId: number) => {
          _clearPreviousComputing()
          autoAdvanceTimeout = setTimeout(() => {
            if (originalRequestId !== requestIdCounter) return
            const nextIndex = get().indexActive + 1
            if (nextIndex >= get().items.length - 1) return

            get().changeIndex(nextIndex)
          }, AUTO_ADVANCE_DURATION)
        }

        return {
          indexActive: initProps?.indexActive ?? INITIAL_STATE.indexActive,
          indexDisplay: initProps?.indexDisplay ?? INITIAL_STATE.indexDisplay,
          items: initProps?.items ?? INITIAL_STATE.items,

          changeIndex: async (index) => {
            const currentRequestId = ++requestIdCounter

            // 0. Clear previous timeouts and async work
            _clearPreviousComputing()

            // 1. Update active immediately
            set({ indexActive: index })

            // 2. Pre-Load image
            const src = get().items[index].cover
            preloadImage(src, () => {
              onLoadAnimationFrame = requestAnimationFrame(() => {
                // If a newer call happened → ignore this one
                if (currentRequestId !== requestIdCounter) return

                // 3. Update display AFTER image is ready
                set({ indexDisplay: index })

                // 4. Auto-Advance to next after a delay if not last item
                if (index >= get().items.length - 1) return
                _autoAdvance(currentRequestId)
              })
            })
          },

          decrementIndex: () => {
            if (get().indexActive <= 0) return
            get().changeIndex(get().indexActive - 1)
          },

          incrementIndex: () => {
            if (get().indexActive >= get().items.length - 1) return
            get().changeIndex(get().indexActive + 1)
          },
        }
      },
      {
        name: 'FastCarouselStore',
        enabled: process.env.NODE_ENV === 'development',
      },
    ),
  )
}
