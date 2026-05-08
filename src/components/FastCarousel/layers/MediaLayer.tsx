import classNames from 'classnames'
import { useContext, useEffect, useMemo, useRef } from 'react'
import { FastCarouselContext } from '../store/context.tsx'
import { useFastCarouselContext } from '../store/useFastCarouselContext.ts'

const FRAMES_PER_SECOND = 60
const BASE_SINGLE_FRAME_DURATION = 1 / FRAMES_PER_SECOND // 0.01666 seconds
const TRANSITION_DURATION = 1_000 // ms
const SINGLE_FRAME_DURATION =
  (BASE_SINGLE_FRAME_DURATION / TRANSITION_DURATION) * 1000

export function MediaLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<ReturnType<typeof requestAnimationFrame>>(null)
  const progressRef = useRef(1)

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

  // Effect to handle image transitions on indexDisplay change
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
      animationRef.current = null
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height } = canvas.getBoundingClientRect()
    canvas.width = width
    canvas.height = height

    const bufferedImage = storeFastCarousel?.getState()._bufferedImage
    const previousImage = storeFastCarousel?.getState()._previousImage

    // If first load and buffered images are not set, fallback to current index image
    if (!bufferedImage || !previousImage) {
      const fallbackImage = new Image()
      fallbackImage.src = images[indexDisplay].src
      fallbackImage.onload = () => {
        ctx.drawImage(fallbackImage, 0, 0, width, height)
      }
      // Save fallback image to buffer for next transitions
      storeFastCarousel?.setState({
        _bufferedImage: fallbackImage,
        _previousImage: fallbackImage,
      })
      // Start auto-advance after initial load
      storeFastCarousel?.getState().autoAdvance(0)
      return
    }

    function transitionFromPrevToNew() {
      ctx!.clearRect(0, 0, width, height)

      // previous image (fade out)
      if (previousImage) {
        ctx!.globalAlpha = 1 - progressRef.current
        ctx!.drawImage(previousImage, 0, 0, width, height)
      }

      // current image (fade in)
      if (bufferedImage) {
        ctx!.globalAlpha = progressRef.current
        ctx!.drawImage(bufferedImage, 0, 0, width, height)
      }

      ctx!.globalAlpha = 1
    }

    function animate() {
      progressRef.current += SINGLE_FRAME_DURATION

      // Cap progress at 1 (seconds)
      if (progressRef.current > 1) {
        progressRef.current = 1
      }

      transitionFromPrevToNew()

      if (progressRef.current < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    // reset transition on image change
    progressRef.current = 0
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [storeFastCarousel, indexDisplay])

  return (
    <canvas
      ref={canvasRef}
      className={classNames(
        'absolute w-full aspect-video h-full block bg-black',
      )}
    />
  )
}
