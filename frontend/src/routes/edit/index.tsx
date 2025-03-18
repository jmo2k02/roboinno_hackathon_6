import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/edit/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/edit/"!</div>
}
