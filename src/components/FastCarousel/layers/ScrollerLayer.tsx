import { ClientOnly } from '@tanstack/react-router'
import classNames from 'classnames'
import type { JSX } from 'react'
import { useContext, useEffect, useMemo, useRef } from 'react'
import { HorizontalList } from '../../HorizontalList/HorizontalList'
import { FastCarouselContext } from '../store/context.tsx'
import { AUTO_ADVANCE_DURATION } from '../store/createFastCarouselStore.ts'
import { useFastCarouselContext } from '../store/useFastCarouselContext.ts'

export function ScrollerLayer(): JSX.Element {
  const storeFastCarousel = useContext(FastCarouselContext)
  const indexActive = useFastCarouselContext((state) => state.indexActive)
  const indexDisplay = useFastCarouselContext((state) => state.indexDisplay)
  const totalItems = useFastCarouselContext((state) => state.items.length)
  const canAutoAdvance = useFastCarouselContext((state) => state.canAutoAdvance)

  const items = useMemo(() => {
    if (!storeFastCarousel) return []
    const state = storeFastCarousel.getState()
    return state.items.map((item) => ({
      id: String(item.id),
      src: item.thumbnail,
    }))
  }, [storeFastCarousel])

  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollAndAlignLeft = (index: number) => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const activeLi = scroller.querySelectorAll('li')[index]

    const scrollerRect = scroller.getBoundingClientRect()
    const liRect = activeLi.getBoundingClientRect()
    const padding = parseFloat(getComputedStyle(scroller).paddingLeft)

    scroller.scrollBy({
      left: liRect.left - scrollerRect.left - padding,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    scrollAndAlignLeft(indexActive)
  }, [indexActive])

  return (
    <>
      <HorizontalList
        ref={scrollerRef}
        activeIndex={indexActive}
        items={items}
      />
      <ClientOnly>
        <div className="inline-flex gap-3 justify-center w-full mt-8">
          {Array.from({ length: totalItems }).map((_, i) => (
            // Page dot
            <div
              key={i}
              className={classNames(
                'relative h-3 rounded-full z-10 max-w-2xs overflow-clip',
                {
                  'w-3': indexActive !== i || !canAutoAdvance, // inactive or active without auto-advance
                  'w-7': indexActive === i && canAutoAdvance, // active with auto-advance
                },
                {
                  'bg-white/25': indexActive !== i, // inactive
                  'bg-white/50 animate-pulse':
                    indexActive === i && indexDisplay !== i, // pending
                  'bg-white/50':
                    indexActive === i && indexDisplay === i && canAutoAdvance, // active with auto-advance
                  'bg-white':
                    indexActive === i && indexDisplay === i && !canAutoAdvance, // active without auto-advance'
                },
              )}
            >
              {canAutoAdvance && indexActive === i && indexDisplay === i && (
                <>
                  <style>{`:root { --animate-fill-progress: ${0}% } `}</style>
                  <div
                    className={classNames(
                      'absolute inset-0 bg-white rounded-full animate-fill pointer-events-none',
                    )}
                    style={{
                      animationDuration: `${AUTO_ADVANCE_DURATION}ms`,
                    }}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </ClientOnly>
    </>
  )
}
