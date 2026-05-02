import type { StateCreator, StoreApi, UseBoundStore } from 'zustand'

const throwErrorOnServerCall = (method: string) => {
  throw new Error(
    `Attempted to call '${method}' on server-side store. (Zustand server Impl)`,
  )
}

/**
 * This function creates a server-side implementation of the FastCarousel store without
 * using zustand's create() since it relies on client-side features. Instead, it returns a hook
 * that allows reading the initial state and logs warnings for any attempted updates.
 *
 * Signature matches zustand's create() for drop-in compatibility with devtools and other middleware.
 *
 * @param stateCreator - State creator function that initializes the store
 * @returns A hook-like function that accepts an optional selector
 *
 * @example
 * const useFastCarousel = createServerImpl((set, get, api) => ({ ... }))
 * const coverIndex = useFastCarousel((state) => state.coverIndex)
 * console.log(coverIndex) // 0
 * useFastCarousel.getState().changeIndex(1) // Throws error on server
 *
 */
export const createServerImpl = <T>(
  stateCreatorFn: StateCreator<T, [], any>,
): UseBoundStore<StoreApi<T>> => {
  let state: T = undefined!

  // Create API object for devtools and middleware compatibility
  const api: StoreApi<T> = {
    getState: () => state,
    getInitialState: () => state,
    setState: throwErrorOnServerCall.bind(null, 'setState'),
    subscribe: throwErrorOnServerCall.bind(null, 'subscribe'),
  }

  // Initialize state by calling the creator function
  state = stateCreatorFn(
    throwErrorOnServerCall.bind(null, 'set'), // set function (no-op)
    // throwErrorOnServerCall.bind(null, 'get'), // get function (returns current state)
    () => state, // get function (returns current state)
    {} as any, // api object (for devtools compatibility)
  )

  // Replace all functions in the state with error-throwing functions
  for (const key in state) {
    if (typeof state[key] === 'function') {
      state[key] = throwErrorOnServerCall.bind(null, key) as any
    }
  }

  // Create the hook function that works with selectors
  const useStore = ((selector?: (state: T) => any) => {
    if (selector) {
      return selector(state)
    }
    return state
  }) as UseBoundStore<StoreApi<T>>

  // Attach store API methods to the hook
  useStore.getState = api.getState
  useStore.getInitialState = api.getInitialState
  useStore.setState = api.setState
  useStore.subscribe = api.subscribe

  return useStore
}
