import { createContext, useState } from 'react'
import type { FastCarouselState } from './createFastCarouselStore.ts'
import { createFastCarouselStore } from './createFastCarouselStore.ts'

const FastCarouselContext = createContext<ReturnType<
  typeof createFastCarouselStore
> | null>(null)

type FastCarouselProviderProps = {
  children: React.ReactNode
} & Partial<FastCarouselState>

function FastCarouselProvider({
  children,
  indexActive,
  indexDisplay,
  items,
}: FastCarouselProviderProps) {
  const [store] = useState(() =>
    createFastCarouselStore({
      indexActive,
      indexDisplay,
      items,
    }),
  )

  return (
    <FastCarouselContext.Provider value={store}>
      {children}
    </FastCarouselContext.Provider>
  )
}

FastCarouselProvider.displayName = 'FastCarouselProvider'

export { FastCarouselContext, FastCarouselProvider }
