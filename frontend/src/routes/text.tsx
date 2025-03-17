import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/text')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/text"!</div>
}
