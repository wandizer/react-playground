// Mocked version of server side create() zustand store
// where the user can use useFastCarousel.getState() to get the current state of the store
// but any state updates will be no-ops and will log a warning instead.
// and Also be able to have useFastCarousel(selector) work with initial state only, without updates.

import type { StoreApi, UseBoundStore } from 'zustand'

type FastCarouselState = {
  coverIndex: number
  scrollerIndex: number
  isCoverReady: boolean
  isVideoReady: boolean
  isTransitioning: boolean
}

type FastCarouselActions = {
  changeIndex: (index: number) => void
  reset: () => void
  setIsCoverReady: (isReady: boolean) => void
}

type FastCarouselStore = FastCarouselState & FastCarouselActions

const serverStore: FastCarouselStore = {
  coverIndex: 0,
  scrollerIndex: 0,
  isCoverReady: false,
  isVideoReady: false,
  isTransitioning: false,
  changeIndex: () => {
    throw new Error(
      'Attempted to changeIndex on server-side store. (Zustand server Impl)',
    )
  },
  reset: () => {
    throw new Error(
      'Attempted to reset on server-side store. (Zustand server Impl)',
    )
  },
  setIsCoverReady: () => {
    throw new Error(
      'Attempted to setIsCoverReady on server-side store. (Zustand server Impl)',
    )
  },
}

/**
 * This function creates a server-side implementation of the FastCarousel store without
 * using zustand's create() since it relies on client-side features. Instead, it returns a hook
 * that allows reading the initial state and logs warnings for any attempted updates.
 *
 * @param stateCreator - State creator function (required by zustand API, though ignored server-side)
 * @returns A hook-like function that accepts an optional selector
 *
 * @example
 * const useFastCarousel = createServerImpl(() => ({ ... }))
 * const coverIndex = useFastCarousel((state) => state.coverIndex)
 * console.log(coverIndex) // 0
 * useFastCarousel.getState().changeIndex(1) // Logs warning and does not change state
 * console.log(useFastCarousel.getState().coverIndex) // Still 0
 *
 */
export function createServerImpl(): UseBoundStore<StoreApi<FastCarouselStore>> {
  // Create the hook function that works with selectors
  const useStore = ((selector?: (state: FastCarouselStore) => any) => {
    if (selector) {
      return selector(serverStore)
    }
    return serverStore
  }) as UseBoundStore<StoreApi<FastCarouselStore>>

  // Attach store API methods
  useStore.getState = () => serverStore
  useStore.getInitialState = () => serverStore
  useStore.setState = () => {
    throw new Error(
      'Attempted to set state on server-side store. (Zustand server Impl)',
    )
  }
  useStore.subscribe = () => {
    throw new Error(
      'Attempted to subscribe to server-side store. Subscriptions are a no-op on the server.',
    )
  }

  return useStore
}
