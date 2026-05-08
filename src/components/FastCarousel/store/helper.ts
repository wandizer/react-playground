/**
 * Preloads an image for a given source URL, and executes an optional callback once loaded.
 * It handles load, error events, cache.
 *
 * @param src - The source URL of the image to preload
 * @param onLoad - Optional callback fired after the image has loaded successfully
 * @example
 *   preloadImage('/path/to/image.jpg', (img) => {
 *     console.log('image loaded', img.src)
 *   })
 */
export function preloadImage(
  src: string,
  onLoad?: (img: HTMLImageElement) => void,
) {
  let done = false
  const img = new Image()

  const finish = () => {
    if (done) return
    done = true
    img.onload = null
    img.onerror = null
    onLoad?.(img)
  }

  img.onload = finish
  img.onerror = finish

  img.src = src

  // Handle cached images - img.complete is true if already loaded
  if (img.complete) {
    onLoad?.(img)
  }
}
