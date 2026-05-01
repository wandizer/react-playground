import { useEffect, useRef, useState } from 'react'
import { useFastCarousel } from '../store/useFastCarousel'
import { Cover } from './Cover'

type Image = {
  src: string
  alt?: string
}

type MediaLayerProps = {
  images: Image[]
}

export function MediaLayer({ images }: MediaLayerProps) {
  const [activeBuffer, setActiveBuffer] = useState<'a' | 'b'>('a')
  const [bufferA, setBufferA] = useState<Image>(images[0])
  const [bufferB, setBufferB] = useState<Image>(images[0])
  const coverIndex = useFastCarousel((state) => state.coverIndex)
  const previousCoverIndex = useRef(coverIndex)

  useEffect(() => {
    if (coverIndex === previousCoverIndex.current) {
      return
    }

    const activeImage = images[coverIndex]

    if (activeBuffer === 'a') {
      setBufferB(activeImage)
    } else {
      setBufferA(activeImage)
    }

    // Toggle active buffer
    setActiveBuffer((prev) => (prev === 'a' ? 'b' : 'a'))
    previousCoverIndex.current = coverIndex
  }, [coverIndex, images, activeBuffer])

  return (
    <>
      {/* Buffer A */}
      {bufferA && (
        <Cover
          key={bufferA.src + '-buffer-a'}
          src={bufferA.src}
          alt={bufferA.alt || ''}
          isVisible={activeBuffer === 'a'}
        />
      )}
      {/* Buffer B */}
      {bufferB && (
        <Cover
          key={bufferB.src + '-buffer-b'}
          src={bufferB.src}
          alt={bufferB.alt || ''}
          isVisible={activeBuffer === 'b'}
        />
      )}
    </>
  )
}
