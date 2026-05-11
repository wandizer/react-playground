/**
 * Preloads an image for a given source URL, and executes an optional callback once loaded.
 * It handles load, error events, cache.
 *
 * @param src - The source URL of the image to preload
 * @param onLoad - Optional callback fired after the image has loaded successfully
 * @param options - { abortable: boolean } - If true, returns an abort function to cancel the preload
 * @example
 *   // Basic usage
 *   preloadImage('/path/to/image.jpg', (img) => {
 *     console.log('image loaded', img.src)
 *   })
 *
 *   // With abort support
 *   const { abort } = preloadImage('/path/to/image.jpg', (img) => {
 *    console.log('image loaded', img.src)
 *   }, { abortable: true })
 *
 *   // To cancel the preload if it's no longer needed
 *   abort()
 *
 */
export function preloadImage(
  src: string,
  onLoad?: (img: HTMLImageElement) => void,
  options: { abortable?: boolean } = {},
): { abort?: () => void } {
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

  let abort: (() => void) | undefined
  if (options.abortable) {
    // For abortable preloads, we use the fetchImageWithAbort function
    // which supports cancellation. Whenever the blob is fetched, it
    // will go through img.onload or img.onerror as usual, even when
    // the fetched blob is already cached by the browser.
    const { abort: abortFetch } = fetchImageWithAbort(img, src)
    abort = abortFetch
    return { abort }
  }

  // Let the browser handle image load and caching as usual
  img.src = src

  // Handle cached images - img.complete is true if already loaded
  if (img.complete) {
    finish()
  }

  return { abort }
}

/**
 * Fetch function with abort support, using Fetch API
 */
function _abortableFetch(
  request: string | URL | Request,
  opts: RequestInit = {},
) {
  const controller = new AbortController()
  const signal = controller.signal

  return {
    abort: () => controller.abort(),
    ready: fetch(request, { ...opts, signal }),
  }
}

/**
 * XMLHttpRequest with abort support (for older browsers that don't support abortable fetch)
 */
function _abortableXHR(
  url: string,
  opts: {
    method?: string
    headers?: Record<string, string>
    body?: Document | XMLHttpRequestBodyInit | null
    responseType?: XMLHttpRequestResponseType
  } = {},
) {
  const xhr = new XMLHttpRequest()

  const ready = new Promise<XMLHttpRequest>((resolve, reject) => {
    xhr.open(opts.method || 'GET', url, true)

    if (opts.responseType) {
      xhr.responseType = opts.responseType
    }
    if (opts.headers) {
      for (const key in opts.headers) {
        xhr.setRequestHeader(key, opts.headers[key])
      }
    }

    xhr.onload = () => resolve(xhr)
    xhr.onerror = () => {
      reject(new TypeError('Network request failed'))
    }
    xhr.onabort = () => {
      reject(new DOMException('Aborted', 'AbortError'))
    }
    xhr.send(opts.body || null)
  })

  return {
    abort: () => xhr.abort(),
    ready,
  }
}

/**
 * Fetch an image with the ability for aborting the load if it's no longer needed.
 * It uses the Fetch API with AbortController for modern browsers, and falls back
 * to XMLHttpRequest for older browsers.
 *
 * @param img - The HTMLImageElement to set the loaded image source on
 * @param src - The source URL of the image to preload
 * @param onFetched - Optional callback fired after the image has been fetched (before setting src)
 *
 * @returns An object with an `abort` method to cancel the preload, and a `ready`
 * promise that resolves when the image is loaded
 *
 * @example
 *   const img = new Image()
 *   img.onload = () => {
 *     console.log('Image loaded', img.src)
 *   }
 *   const { abort } = fetchImageWithAbort(img, '/path/to/image.jpg')
 *
 *   // To cancel the preload if it's no longer needed
 *   abort()
 */
function fetchImageWithAbort(
  img: HTMLImageElement,
  src: string,
): { abort: () => void } {
  const isAbortableFetchSupported =
    typeof window.fetch === 'function' && // Chrome 42+, Firefox 39+, Safari 10.1+
    typeof window.AbortController === 'function' // Chrome 66+, Firefox 57+, Safari 12.1+

  // If abortable fetch is supported, use it to preload the image
  if (isAbortableFetchSupported) {
    const { abort, ready } = _abortableFetch(src)
    ready
      .then((response) => response.blob())
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob)
        img.src = blobUrl
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error('Image preload failed', { error, src })
        }
        img.src = src // Fallback to direct src if fetch fails
      })

    return { abort }
  }

  // Fallback to XHR for older browsers
  const { abort, ready } = _abortableXHR(src, { responseType: 'blob' })
  ready
    .then((xhr) => {
      const blobUrl = URL.createObjectURL(xhr.response)
      img.src = blobUrl
    })
    .catch((error) => {
      if (error.name !== 'AbortError') {
        console.error('Image preload failed', error)
      }
      img.src = src // Fallback to direct src if XHR fails
    })

  return { abort }
}
