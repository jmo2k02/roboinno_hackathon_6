import CanvasEditor from '@/components/canvas/canvas-editor'
import { Simulator } from '@/components/simulator/simulator'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/_root_layout/editor')({
  component: RouteComponent,
})

function RouteComponent() {

      const [shouldReloadIframe, setShouldReloadIframe] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
    {/* Main Content */}
    <main className="flex-1 p-6 flex flex-col gap-6">
      {/* SVG and Video Container */}
      <div className="flex flex-col md:flex-row gap-6 flex-1">
  
        <CanvasEditor
          width={600}
          height={400}
        />
        <Simulator shouldReloadIframe={shouldReloadIframe} setShouldReloadIframe={setShouldReloadIframe}/>
      </div>
    </main>
    </div>
  )
}
