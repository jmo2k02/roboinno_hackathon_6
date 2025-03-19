import CanvasEditor from '@/components/canvas/canvas-editor'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_root_layout/editor')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
  
      <CanvasEditor
        width={600}
        height={400}
      />
    </>
  )
}
