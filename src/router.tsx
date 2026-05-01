import {
  createRouter as createTanStackRouter,
  ErrorComponent,
} from '@tanstack/react-router'
import NotFound from './components/NotFound/NotFound.tsx'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    // Shown when an error bubbles to the router
    defaultErrorComponent: ({ error, reset }) => (
      <>
        <ErrorComponent error={error} />
        <button onClick={() => reset()}>Reset</button>
      </>
    ),
    defaultNotFoundComponent: ({ data, isNotFound, routeId }) => (
      <NotFound routeId={routeId} data={data} isNotFound={isNotFound} />
    ),
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
