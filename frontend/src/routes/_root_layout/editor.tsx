import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_root_layout/editor')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/editor"!</div>
}
