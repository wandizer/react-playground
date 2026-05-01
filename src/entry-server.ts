import handler, { createServerEntry } from '@tanstack/react-start/server-entry'

export default createServerEntry({
  fetch(request) {
    const url = new URL(request.url)

    // Handle specific routes
    if (url.pathname === '/health') {
      return new Response('OK', {
        status: 200,
        headers: { 'content-type': 'text/plain' },
      })
    }

    // Add custom headers to all requests
    // Return nothing to continue to the next handler

    return handler.fetch(request)
  },
})
