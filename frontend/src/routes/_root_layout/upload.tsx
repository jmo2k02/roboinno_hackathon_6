import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { getPreviewApiV1RobotGetPreviewPostMutation } from '@/client/@tanstack/react-query.gen';
import { Simulator } from '@/components/simulator/simulator';

export const Route = createFileRoute('/_root_layout/upload')({
  component: RouteComponent,
})

function RouteComponent() {
    const [svgFile, setSvgFile] = useState<File | null>();
    const [svgPreview, setSvgPreview] = useState<string | null>(null);
    const [shouldReloadIframe, setShouldReloadIframe] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [model, setModel] = useState("frankie");
    const [teachme, setTeachme] = useState(false);
    
    const mutation = useMutation({
        ...getPreviewApiV1RobotGetPreviewPostMutation()
    })
  
    const handleSvgUpload = (e) => {
      const file: File = e.target.files[0];
      if (file && file.type === 'image/svg+xml') {
        setSvgFile(file);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          setSvgPreview(e.target.result as string);
        };
        reader.readAsText(file);

        mutation.mutate({
            body: {
                svg_file: file,
            },
            query: {
                token: "test",
                teachme: teachme,
                model: model
            }
        })
        
        setShouldReloadIframe(true);
      }
    };
  
    // Effect to handle iframe reload
    useEffect(() => {
      if (shouldReloadIframe) {
        const timer = setTimeout(() => {
          if (iframeRef.current) {
            const currentSrc = iframeRef.current.src;
            iframeRef.current.src = currentSrc;
            console.log("Iframe reloaded");
          }
          setShouldReloadIframe(false);
        }, 2000);
        
        return () => clearTimeout(timer);
      }
    }, [shouldReloadIframe]);
  
    const clearSvgPreview = () => {
      setSvgFile(null);
      setSvgPreview(null);
    };

    return (
      <div className="flex flex-col h-screen bg-gray-100">
        <main className="flex-1 p-6 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row gap-6 flex-1">
            <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden p-6">
              <h2 className="text-lg font-medium mb-4">SVG Upload</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Select Model:</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="frankie">Frankie</option>
                  <option value="panda560">Panda</option>
                  <option value="ur10">UR10</option>
                </select>
              </div>
              
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  id="teachme"
                  checked={teachme}
                  onChange={(e) => setTeachme(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="teachme" className="text-sm text-gray-700">Enable TeachMe</label>
              </div>
              
              {!svgPreview ? (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12">
                  <Upload size={48} className="text-gray-400 mb-4" />
                  <p className="text-gray-600 text-center mb-6">Drag and drop your SVG file here or click to browse</p>
                  <label className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md cursor-pointer">
                    Select SVG File
                    <input 
                      type="file" 
                      accept=".svg" 
                      className="hidden" 
                      onChange={handleSvgUpload}
                    />
                  </label>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-600">{svgFile?.name || 'SVG Preview'}</span>
                    <button 
                      onClick={clearSvgPreview}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                    <div dangerouslySetInnerHTML={{ __html: svgPreview }} />
                  </div>
                </div>
              )}
            </div>

            <Simulator 
              shouldReloadIframe={shouldReloadIframe}
              setShouldReloadIframe={setShouldReloadIframe}
              reloadTime={2000}
            />
          </div>
        </main>
      </div>
    );
}