import { getPreviewApiV1RobotGetPreviewPostMutation } from '@/client/@tanstack/react-query.gen'
import CanvasEditor from '@/components/canvas/canvas-editor'
import DrawingCanvas from '@/components/canvas/canvas-editor'
import { DialogCloseButton, DialogDemo } from '@/components/robo_sim/iframe-dialog'
import { Simulator } from '@/components/simulator/simulator'
import useEditorStore from '@/stores/editor-store'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'

export const Route = createFileRoute('/_root_layout/editor')({
    component: RouteComponent,
})

function RouteComponent() {
    const [shouldReloadIframe, setShouldReloadIframe] = useState(false);
    const editorStore = useEditorStore()

    const [svgFile, setSvgFile] = useState<File | null>();
    const [svgPreview, setSvgPreview] = useState<string | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const mutation = useMutation({
        ...getPreviewApiV1RobotGetPreviewPostMutation()
    })

    useEffect(() => {
        if (shouldReloadIframe) {
            const timer = setTimeout(() => {
                if (iframeRef.current) {
                    const currentSrc = iframeRef.current.src;
                    iframeRef.current.src = currentSrc;
                    console.log("Iframe reloaded");
                }
                setShouldReloadIframe(false);
            }, 13000);

            return () => clearTimeout(timer);
        }
    }, [shouldReloadIframe]);


    return (
        <div className="flex flex-col h-screen bg-gray-100">
        {/* Main Content */}
        <main className="flex-1 p-6 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6 flex-1">
            {/* Text Input Card - Now with auto-height */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:w-1/3">
              <div className="p-6 flex flex-col">
                <h2 className="text-lg font-medium mb-4">Let the robot know what to draw</h2>
                
                <div className="flex flex-col gap-4">
                  {/* Text Area */}
                  <CanvasEditor
                    setShouldReloadIframe={setShouldReloadIframe}
                  />
                  
                  {/* Submit Button */}
                  <div className="flex justify-end mt-auto">
                    
                  </div>
                </div>
              </div>
            </div>

            {/* Robot Simulation Card */}
            {/* Use the new Simulator component */}
                        <Simulator 
                          shouldReloadIframe={shouldReloadIframe}
                          setShouldReloadIframe={setShouldReloadIframe}
                        />
          </div>
        </main>
      </div>
    )
}
