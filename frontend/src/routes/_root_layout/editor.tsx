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
    <div className="flex flex-col h-screen bg-gray-100">
    {/* Main Content */}
    <main className="flex-1 p-6 flex flex-col gap-6">
      {/* SVG and Video Container */}
      <div className="flex flex-col md:flex-row gap-6 flex-1">
  
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
