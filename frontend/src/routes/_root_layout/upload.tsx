import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { getPreviewApiV1RobotGetPreviewPostMutation} from '@/client/@tanstack/react-query.gen';

export const Route = createFileRoute('/_root_layout/upload')({
  component: RouteComponent,
})

function RouteComponent() {
    const [svgFile, setSvgFile] = useState<File | null>();
    const [svgPreview, setSvgPreview] = useState<string | null>(null);
    const [shouldReloadIframe, setShouldReloadIframe] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    
    const mutation = useMutation({
        ...getPreviewApiV1RobotGetPreviewPostMutation()
    })
  
    const handleSvgUpload = (e) => {
      const file: File = e.target.files[0];
      if (file && file.type === 'image/svg+xml') {
        setSvgFile(file);
        
        // Read the SVG as text
        const reader = new FileReader();
        reader.onload = (e) => {
          setSvgPreview(e.target.result as string);
        };
        reader.readAsText(file);

        mutation.mutate({
            body: {
                svg_file: file
            },
            query: {
                token: "test"
            }
        })
        
        // Trigger iframe reload after 2 seconds
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
        {/* Main Content */}
        <main className="flex-1 p-6 flex flex-col gap-6">
          {/* SVG and Video Container */}
          <div className="flex flex-col md:flex-row gap-6 flex-1">
            {/* SVG Upload Card */}
            <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 flex flex-col h-full">
                <h2 className="text-lg font-medium mb-4">SVG Upload</h2>
                
                {!svgPreview ? (
                  <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12">
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
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-600">{svgFile?.name || 'SVG Preview'}</span>
                      <button 
                        onClick={clearSvgPreview}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                      {/* Safe SVG rendering */}
                      <div 
                        className="max-w-full max-h-full" 
                        dangerouslySetInnerHTML={{ __html: svgPreview }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
  
            {/* Video Player Card */}
            <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 flex flex-col h-full">
                <h2 className="text-lg font-medium mb-4">Robot simulation</h2>
                <div className="flex-1 flex flex-col bg-black rounded-lg overflow-hidden">
                  <div className="flex-1 relative">
                    <iframe
                      ref={iframeRef}
                      src="http://localhost:52000/?53000"
                      title="Video Player"
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
}