import CanvasEditor from '@/components/canvas/canvas-editor'
import DrawingCanvas from '@/components/canvas/canvas-editor'
import { DialogCloseButton, DialogDemo } from '@/components/robo_sim/iframe-dialog'
import useEditorStore from '@/stores/editor-store'
 import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_root_layout/editor')({
  component: RouteComponent,
})

function RouteComponent() {
    const editorStore = useEditorStore()
  return (
    <>
  
      <CanvasEditor
      />
      {editorStore.createdSvg ? (
        <p>User has create a svg</p>
      ) : (
        null
      )}
      <DialogDemo
      open={editorStore.createdSvg} 
      setOpen={editorStore.invertCreatedSvg}
      />
    </>
  )
}
