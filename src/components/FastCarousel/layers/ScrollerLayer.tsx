import type { JSX } from 'react'
import { useContext, useEffect, useMemo, useRef } from 'react'
import { HorizontalList } from '../../HorizontalList/HorizontalList'
import { FastCarouselContext } from '../store/context.tsx'
import { useFastCarouselContext } from '../store/useFastCarouselContext.ts'

export function ScrollerLayer(): JSX.Element {
  const storeFastCarousel = useContext(FastCarouselContext)
  const indexActive = useFastCarouselContext((state) => state.indexActive)

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
    <HorizontalList ref={scrollerRef} activeIndex={indexActive} items={items} />
  )
}
