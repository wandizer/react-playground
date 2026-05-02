import type { StateCreator, StoreApi, UseBoundStore } from 'zustand'

const throwErrorOnServerCall = (method: string) => {
  throw new Error(
    `Attempted to call '${method}' on server-side store. (Zustand server Impl)`,
  )
}

/**
 * Server-side implementation of a Zustand store creator function.
 *
 * It does not create a real store since that relies on client-side features, and
 * to avoids server data leakage (e.g. concurrent server instance loading the same
 * store, which might be problematic). Instead, it returns a stub version of the
 * create() function that only allows reading the initial state (read-only), and
 * directly throws an error if trying to mutate the state or subscribe to changes.
 *
 * This is useful for server-side rendering (SSR) scenarios where you want to use
 * the same store definition on both client and server, but only allow state updates
 * on the client.
 *
 * Signature matches zustand's create() for drop-in compatibility with other middleware,
 * and keeps the same API shape for the returned hook, by slightly modifying the API
 * object passed to the state creator function to replace the set and subscribe methods
 * with error-throwing functions.
 *
 * @param stateCreator - State creator function that initializes the store
 * @returns A hook-like function that accepts an optional selector
 *
 * @example
 * // useStore.ts
 * const isServer = typeof window === 'undefined';
 * const createImpl = isServer ? createServerImpl : create // Zustand's create()
 * const useStore = createImpl((set, get, api) => ({
 *     foo: 'bar',
 *     setFoo: (value) => set({ foo: value })
 *   })
 * )
 *
 * // MyComponent.tsx
 * // ✅ Usage in server side
 * const foo = useStore((state) => state.foo) // Always returns initial state on server
 * const setFoo = useStore((state) => state.setFoo) // Returns error-throwing function on server
 * useStore.getState().foo // Always returns initial state on server
 *
 * // ❌ Attempting to update state on server throws error
 * setFoo('toto') // Throws error on server
 * useFastCarousel.getState().setFoo('toto') // Throws error on server
 * useFastCarousel.setState({ foo: 'toto' }) // Throws error on server
 * useFastCarousel.subscribe(() => {}) // Throws error on server
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
