import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_root_layout/voice')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_root_layout/voice"!</div>
}
