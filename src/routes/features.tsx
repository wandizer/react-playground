import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/features')({
  component: Features,
})

function Features() {
  return <Outlet />
}
