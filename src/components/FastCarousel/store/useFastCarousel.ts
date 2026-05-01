import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export const TRANSITION_DURATION = 500
export const DEBOUNCE_DURATION = 500

type FastCarouselState = {
  itemCount: number
  coverIndex: number
  scrollerIndex: number
  isCoverReady: boolean
  isVideoReady: boolean
  isTransitioning: boolean
}

type FastCarouselActions = {
  changeIndex: (index: number) => void
  setIsCoverReady: (isReady: boolean) => void
}

type FastCarouselStore = FastCarouselState & FastCarouselActions

export type TimeoutRef = ReturnType<typeof requestAnimationFrame> | undefined
export const clearTimeoutRef = (timeoutRef: { current: TimeoutRef }) => {
  if (!timeoutRef.current) {
    return
  }
  clearTimeout(timeoutRef.current)
  cancelAnimationFrame(timeoutRef.current)
  timeoutRef.current = undefined
}

const isServer =
  typeof window === 'undefined' ||
  typeof window.document === 'undefined' ||
  typeof window.document.createElement === 'undefined'

const timeOutSetCoverIndexRef: { current: TimeoutRef } = { current: undefined }
const timeOutSetIsVideoReady: { current: TimeoutRef } = { current: undefined }

type OnAnimationComplete = () => void

const createAnimateFrame = (onComplete: OnAnimationComplete) => {
  let startTime: number | null = null

  const animate = (timestamp: number) => {
    if (!startTime) startTime = timestamp
    const elapsed = timestamp - startTime

    if (elapsed >= DEBOUNCE_DURATION) {
      onComplete()
    } else {
      timeOutSetCoverIndexRef.current = requestAnimationFrame(animate)
    }
  }

  return animate
}

export const useFastCarousel = create<FastCarouselStore>()(
  devtools(
    (set, get) => {
      return {
        // Initial state
        coverIndex: 0,
        scrollerIndex: 0,
        isTransitioning: false,
        isCoverReady: false,
        isVideoReady: false,
        // Actions
        changeIndex: (index: number) => {
          if (isServer) {
            console.warn(
              'Attempted to change index on server. This action is client-only.',
            )
            return
          }

          // Do nothing if index is the same as current
          if (index === get().scrollerIndex && index === get().coverIndex) {
            return
          }

          // Clear any pending transition timeouts
          clearTimeoutRef(timeOutSetCoverIndexRef)
          clearTimeoutRef(timeOutSetIsVideoReady)

          // Start transition: set scrollerIndex immediately, then after transition duration, update coverIndex
          set({
            scrollerIndex: index,
            isTransitioning: true,
            isCoverReady: false,
            isVideoReady: false,
          })

          timeOutSetCoverIndexRef.current = requestAnimationFrame(
            createAnimateFrame(() =>
              set(
                { coverIndex: index, isTransitioning: false },
                false,
                'changeIndex/coverIndexChanged',
              ),
            ),
          )

          // TimeOut for
        },

        setIsCoverReady: (isReady: boolean) => {
          set({ isCoverReady: isReady })

          if (!isReady) return
          timeOutSetIsVideoReady.current = requestAnimationFrame(
            createAnimateFrame(() =>
              set(
                { isVideoReady: true },
                false,
                'setIsCoverReady/isVideoReady',
              ),
            ),
          )
        },
      }
    },
    {
      name: 'FastCarouselStore',
      serialize: {
        options: {
          name: 'FastCarouselStore',
          // Avoid serializing functions and complex objects in devtools
          skip: (_key: unknown, value: unknown) =>
            typeof value === 'function' || typeof value === 'object',
        },
      },
    },
  ),
)
