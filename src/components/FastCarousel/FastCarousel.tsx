import { memo } from 'react'
import { useEventListener } from 'usehooks-ts'
import { MediaLayer } from './layers/MediaLayer.tsx'
import { ScrollerLayer } from './layers/ScrollerLayer.tsx'
import { UiLayer } from './layers/UiLayer.tsx'
import { useFastCarouselContext } from './store/useFastCarouselContext.ts'

const StaticOverlay = memo(() => (
  <div className="absolute w-full aspect-video bg-linear-to-t from-black to-70% to-transparent z-10 pointer-events-none" />
))

function FastCarousel() {
  const incrementIndex = useFastCarouselContext((state) => state.incrementIndex)
  const decrementIndex = useFastCarouselContext((state) => state.decrementIndex)

  useEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) {
      return
    }
    const direction = event.key === 'ArrowLeft' ? 'left' : 'right'
    if (direction === 'left') {
      decrementIndex()
    } else {
      incrementIndex()
    }
  })

  return (
    <div className="relative w-screen aspect-video overflow-hidden flex flex-col">
      {/* Media Layer */}
      <MediaLayer />

      {/* Static overlay (NEVER changes) - memoized to prevent repaints */}
      <StaticOverlay />

      {/* UI Layer */}
      <UiLayer />

      {/* Horizontal list with thumbnails */}
      <ScrollerLayer />
    </div>
  )
}

export default FastCarousel
