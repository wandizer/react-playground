import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { preloadImage } from './helper.ts'

describe('preloadImage', () => {
  interface IMockImage {
    src: string
    complete: boolean
    onload: (() => void) | null
    onerror: ((err: any) => void) | null
  }

  let currentImage: IMockImage | null = null

  beforeEach(() => {
    class MockImage implements IMockImage {
      src = ''
      complete = false
      onload: (() => void) | null = null
      onerror: (() => void) | null = null

      constructor() {
        currentImage = this
      }
    }

    vi.stubGlobal('Image', MockImage)
  })

  afterEach(() => {
    currentImage = null
    vi.unstubAllGlobals()
  })

  it('should call onLoad when image loads successfully', () => {
    const onLoad = vi.fn()
    preloadImage('/test.jpg', onLoad)

    currentImage?.onload?.()

    expect(onLoad).toHaveBeenCalledOnce()
  })

  it('should call onLoad when image fails to load', () => {
    const onLoad = vi.fn()
    preloadImage('/test.jpg', onLoad)

    currentImage?.onerror?.(new Error('Image load failed'))

    expect(onLoad).toHaveBeenCalledOnce()
  })

  it('should call onLoad only once even if both load and error fire', () => {
    const onLoad = vi.fn()
    preloadImage('/test.jpg', onLoad)

    currentImage?.onload?.()
    currentImage?.onerror?.(new Error())

    expect(onLoad).toHaveBeenCalledOnce()
  })

  it('should call onLoad immediately for cached images', () => {
    const onLoad = vi.fn()

    // Mark the image as already cached before src is set
    vi.stubGlobal(
      'Image',
      class {
        src = ''
        complete = true
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        constructor() {
          currentImage = this
        }
      },
    )

    preloadImage('/test.jpg', onLoad)

    expect(onLoad).toHaveBeenCalledOnce()
  })

  it('should not throw when called without an onLoad callback', () => {
    expect(() => {
      preloadImage('/test.jpg')
      currentImage?.onload?.()
    }).not.toThrow()
  })

  it('should set image src', () => {
    preloadImage('/test.jpg')

    expect(currentImage?.src).toBe('/test.jpg')
  })
})
