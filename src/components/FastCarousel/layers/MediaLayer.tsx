import classNames from 'classnames'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { FastCarouselContext } from '../store/context.tsx'
import { useFastCarouselContext } from '../store/useFastCarouselContext.ts'

type Image = {
  src: string
  alt?: string
}

export function MediaLayer() {
  const storeFastCarousel = useContext(FastCarouselContext)
  const indexDisplay = useFastCarouselContext((state) => state.indexDisplay)

  const images = useMemo(() => {
    if (!storeFastCarousel) return []
    const state = storeFastCarousel.getState()
    return state.items.map((item) => ({
      src: item.cover,
      alt: item.alt,
    }))
  }, [storeFastCarousel])

  const [activeBuffer, setActiveBuffer] = useState<'A' | 'B'>('A')
  const [bufferA, setBufferA] = useState<Image>(images[0])
  const [bufferB, setBufferB] = useState<Image>(images[0])
  const previousIndexDisplay = useRef(indexDisplay)

  useEffect(() => {
    if (indexDisplay === previousIndexDisplay.current) {
      return
    }

    if (activeBuffer === 'A') {
      setBufferB(images[indexDisplay])
    } else {
      setBufferA(images[indexDisplay])
    }
    // Toggle active buffer
    setActiveBuffer((prev) => (prev === 'A' ? 'B' : 'A'))
    previousIndexDisplay.current = indexDisplay
  }, [indexDisplay, images, activeBuffer])

  return (
    <>
      {/* Buffer A */}
      <img
        className={classNames(
          'absolute w-full aspect-video h-full',
          'bg-no-repeat bg-center object-cover',
          'transition-opacity duration-500 ease-linear',
          {
            'opacity-0': activeBuffer !== 'A',
            'delay-500 opacity-100': activeBuffer === 'A',
          },
        )}
        src={bufferA.src}
        alt={bufferA.alt || ''}
      />

      {/* Buffer B */}
      <img
        className={classNames(
          'absolute w-full aspect-video h-full',
          'bg-no-repeat bg-center object-cover',
          'transition-opacity duration-500 ease-linear',
          {
            'opacity-0': activeBuffer !== 'B',
            'delay-500 opacity-100': activeBuffer === 'B',
          },
        )}
        src={bufferB.src}
        alt={bufferB.alt || ''}
      />
    </>
  )
}
