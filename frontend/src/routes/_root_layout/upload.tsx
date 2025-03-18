import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { runRobotUsingSvgApiV1RobotRunWithSvgPostMutation } from '@/client/@tanstack/react-query.gen';

export const Route = createFileRoute('/_root_layout/upload')({
  component: RouteComponent,
})

function RouteComponent() {
    const [svgFile, setSvgFile] = useState<File | null>();
    const [svgPreview, setSvgPreview] = useState(null);
    const mutation = useMutation({
        ...runRobotUsingSvgApiV1RobotRunWithSvgPostMutation()
    })
  
    const handleSvgUpload = (e) => {
      const file: File = e.target.files[0];
      console.log("test2")
      if (file && file.type === 'image/svg+xml') {
        setSvgFile(file);
        
        // Create a preview URL for the SVG
        const reader = new FileReader();
        reader.onload = (e) => {
          setSvgPreview(e.target.result);
        };
        reader.readAsDataURL(file);

        console.log("test")


        mutation.mutate({
            body: {
                svg_file: file
            },
            query: {
                token: "test"
            }
        })

      }
    };
  
    const clearSvgPreview = () => {
      setSvgFile(null);
      setSvgPreview(null);
    };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Main Content */}
      <main className="flex-1 p-6 flex flex-col md:flex-row gap-6">
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
                  <div className="max-w-full max-h-full" dangerouslySetInnerHTML={{ __html: svgPreview }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Player Card */}
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 flex flex-col h-full">
            <h2 className="text-lg font-medium mb-4">Video Player</h2>
            <div className="flex-1 flex flex-col bg-black rounded-lg overflow-hidden">
              <div className="flex-1 relative">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
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
      </main>
    </div>
  );
}


