import { useEffect, useRef, type JSX } from 'react'
import { HorizontalList } from '../../HorizontalList/HorizontalList'
import { useFastCarousel } from '../store/useFastCarousel'

type ScrollerItem = {
  id: string
  src: string
}

type ScrollerLayerProps = {
  items: ScrollerItem[]
}

export function ScrollerLayer({ items }: ScrollerLayerProps): JSX.Element {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const scrollerIndex = useFastCarousel((state) => state.scrollerIndex)

  const scrollAndAlignLeft = (index: number) => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const activeLi = scroller.querySelectorAll('li')?.[index]
    if (!activeLi) return

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

    scrollAndAlignLeft(scrollerIndex)
  }, [scrollerIndex])

  return (
    <HorizontalList
      ref={scrollerRef}
      activeIndex={scrollerIndex}
      items={items}
    />
  )
}
