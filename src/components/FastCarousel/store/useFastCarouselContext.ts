import { useContext } from 'react'
import { useStore } from 'zustand'
import { FastCarouselContext } from './context.tsx'
import type { FastCarouselStore } from './createFastCarouselStore.ts'

export function useFastCarouselContext<T>(
  selector: (state: FastCarouselStore) => T,
): T {
  const store = useContext(FastCarouselContext)
  if (!store)
    throw new Error('Missing FastCarouselContext.Provider in the tree')
  return useStore(store, selector)
}
