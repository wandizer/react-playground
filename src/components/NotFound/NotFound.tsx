import type { NotFoundRouteProps } from '@tanstack/react-router'
import { Container } from '../Ui/Container.tsx'

export default function NotFound({
  routeId,
  data,
  isNotFound,
}: NotFoundRouteProps) {
  return (
    <Container className="h-200 flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl">
        <b className="text-primary text-6xl">404:</b> Page Not Found
      </h1>
      <p>The page you are looking for does not exist. Perhaps a typo?</p>
      {routeId && <p>Route ID: {routeId}</p>}
      {(data as any) && <p>Data: {JSON.stringify(data)}</p>}
      {isNotFound && <p>Is Not Found: {isNotFound?.toString()}</p>}
    </Container>
  )
}
