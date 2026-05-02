import { create as createClientImpl } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createServerImpl } from './createServerImpl.ts'
import type { FastCarouselStore } from './types.ts'

export const TRANSITION_DURATION = 500
export const DEBOUNCE_DURATION = 500

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

const createImpl = isServer ? createServerImpl : createClientImpl

export const useFastCarousel = createImpl<FastCarouselStore>(
  devtools(
    (set, get, api) => ({
      // Initial state
      coverIndex: 0,
      scrollerIndex: 0,
      isCoverReady: false,
      isVideoReady: false,
      isTransitioning: false,
      // Actions
      changeIndex: (index: number) => {
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
      },

      reset: () => {
        clearTimeoutRef(timeOutSetCoverIndexRef)
        clearTimeoutRef(timeOutSetIsVideoReady)
        set(api.getInitialState())
      },

      setIsCoverReady: (isReady: boolean) => {
        set({ isCoverReady: isReady })

        if (!isReady) return
        timeOutSetIsVideoReady.current = requestAnimationFrame(
          createAnimateFrame(() =>
            set({ isVideoReady: true }, false, 'setIsCoverReady/isVideoReady'),
          ),
        )
      },
    }),
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
