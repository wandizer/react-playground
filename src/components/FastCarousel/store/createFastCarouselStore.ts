import { createStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { preloadImage } from './helper/preloadImage.ts'
import type { CarouselItem } from './types.ts'

export const AUTO_ADVANCE_DURATION = 10_000

const isServer =
  typeof window === 'undefined' ||
  typeof window.document === 'undefined' ||
  typeof window.document.createElement === 'undefined'

export type FastCarouselState = {
  indexActive: number
  indexDisplay: number
  items: CarouselItem[]
  // exposes current decoded images for canvas
  _bufferedImage: HTMLImageElement | null
  _previousImage: HTMLImageElement | null
  // Config
  canAutoAdvance?: boolean
  canAutoAbortPreload?: boolean
  canPreloadCloseImages?: boolean
}

export type FastCarouselActions = {
  autoAdvance: (originalRequestId: number) => void
  changeIndex: (index: number) => void
  decrementIndex: () => void
  incrementIndex: () => void
  setAutoAdvance?: (value: boolean) => void
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
  let abortImagePreload: (() => void) | null = null
  const preloadedImageIndexes = new Set<number>() // to track already preloaded images and avoid redundant work
  let autoAdvanceTimeout: ReturnType<typeof setTimeout> | null = null
  let onLoadAnimationFrame: ReturnType<typeof requestAnimationFrame> | null =
    null

  return createStore<FastCarouselStore>()(
    devtools(
      (set, get, _api) => {
        const _clearPreviousComputing = () => {
          // Cancel previous image preload
          if (abortImagePreload && get().canAutoAbortPreload) {
            abortImagePreload()
            abortImagePreload = null
          }
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

        /**
         * Helper to get indices of images to pre-load based on current index and overscan count.
         * @example
         *  currentIndex = 5, overscan = 1 → [4, 5, 6]
         *  currentIndex = 0, overscan = 1 → [0, 1]
         *  currentIndex = last, overscan = 1 → [last - 1, last]
         *  currentIndex = 5, overscan = 2 → [3, 4, 5, 6, 7]
         */
        const _getCloseIndices = ({ overscan = 1 }: { overscan?: number }) => {
          const items = get().items
          const currentIndex = get().indexActive
          const indicesToPreload = []
          for (
            let i = currentIndex - overscan;
            i <= currentIndex + overscan;
            i++
          ) {
            if (i >= 0 && i < items.length) {
              indicesToPreload.push(i)
            }
          }
          return indicesToPreload
        }

        /**
         * Pre-load nearby images around the current index for smoother navigation
         */
        const _preloadCloseImages = () => {
          const items = get().items
          const currentIndex = get().indexActive
          // Preload 2 images before and after current index for smoother navigation
          const indicesToPreload = _getCloseIndices({ overscan: 4 })
          indicesToPreload.forEach((index) => {
            if (index === currentIndex) return // current image is already loaded
            if (preloadedImageIndexes.has(index)) return // already preloaded
            const src = items[index].cover
            if (!src) return
            preloadImage(
              src,
              () => {
                preloadedImageIndexes.add(index)
              },
              { abortable: true },
            )
          })
        }

        return {
          indexActive: initProps?.indexActive ?? INITIAL_STATE.indexActive,
          indexDisplay: initProps?.indexDisplay ?? INITIAL_STATE.indexDisplay,
          items: initProps?.items ?? INITIAL_STATE.items,

          // exposes current decoded images for canvas
          _bufferedImage: null,
          _previousImage: null,

          // Config
          canAutoAdvance: initProps?.canAutoAdvance ?? true,
          canAutoAbortPreload: initProps?.canAutoAbortPreload ?? true,
          canPreloadCloseImages: initProps?.canPreloadCloseImages ?? true,

          autoAdvance: (originalRequestId: number) => {
            _clearPreviousComputing()
            autoAdvanceTimeout = setTimeout(() => {
              if (originalRequestId !== requestIdCounter) return
              const nextIndex = get().indexActive + 1
              if (nextIndex >= get().items.length) return
              if (!get().canAutoAdvance) return
              get().changeIndex(nextIndex)
            }, AUTO_ADVANCE_DURATION)
          },

          changeIndex: async (index) => {
            if (isServer) return
            if (index === get().indexActive) return
            const currentRequestId = ++requestIdCounter

            // 0. Clear previous timeouts and async work
            _clearPreviousComputing()

            // 1. Update active immediately
            set({ indexActive: index })

            // 2. Pre-Load image
            const src = get().items[index].cover
            const { abort } = preloadImage(
              src,
              (img) => {
                preloadedImageIndexes.add(index) // mark this index as preloaded
                onLoadAnimationFrame = requestAnimationFrame(() => {
                  // If a newer call happened → ignore this one
                  if (currentRequestId !== requestIdCounter) return

                  // 3. Update display AFTER image is ready
                  const previousImage = get()._bufferedImage
                  set({
                    indexDisplay: index,
                    _previousImage: previousImage ?? img,
                    _bufferedImage: img,
                  })

                  // 4. Auto-Advance to next after a delay if not last item
                  if (index < get().items.length - 1 && get().canAutoAdvance) {
                    get().autoAdvance(currentRequestId)
                  }

                  // 5. Pre-cache nearby images for smoother navigation
                  _preloadCloseImages()
                })
              },
              { abortable: get().canAutoAbortPreload },
            )

            // Save abort function to cancel if user changes index before load completes
            if (abort) {
              abortImagePreload = abort
            }
          },

          decrementIndex: () => {
            if (get().indexActive <= 0) return
            get().changeIndex(get().indexActive - 1)
          },

          incrementIndex: () => {
            if (get().indexActive >= get().items.length - 1) return
            get().changeIndex(get().indexActive + 1)
          },

          setAutoAdvance: (value: boolean) => {
            set({ canAutoAdvance: value })
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
