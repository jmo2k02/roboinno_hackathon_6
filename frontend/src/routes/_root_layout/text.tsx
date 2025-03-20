import { generateSvgFromPromptApiV1SvgGenerateSvgFromPromptPostMutation } from '@/client/@tanstack/react-query.gen';
import { Simulator } from '@/components/simulator/simulator';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react';

export const Route = createFileRoute('/_root_layout/text')({
  component: RouteComponent,
})

function RouteComponent() {
    const [inputText, setInputText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shouldReloadIframe, setShouldReloadIframe] = useState(false);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const mutation = useMutation({
        ...generateSvgFromPromptApiV1SvgGenerateSvgFromPromptPostMutation()
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
    
    // Function to handle text submission
    const handleSubmit = async () => {
      if (!inputText.trim()) return;
      
      setIsSubmitting(true);
      
      try {
        console.log('Sending text to endpoint:', inputText);
        mutation.mutate({
          body:{text: inputText},
          query: {
            token: "ersatztoken",
          }
        })
        
        setShouldReloadIframe(true);
      } catch (error) {
        console.error('Error submitting text:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  
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
                  <div className="flex-grow">
                    <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-1">
                      Enter your text
                    </label>
                    <textarea
                      id="text-input"
                      className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                      placeholder="Type something and press send to let the robot draw"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                    ></textarea>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="flex justify-end mt-auto">
                    <button
                      className={`px-4 py-2 rounded-md text-white ${
                        isSubmitting 
                          ? 'bg-blue-400 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      onClick={handleSubmit}
                      disabled={isSubmitting || !inputText.trim()}
                    >
                      {isSubmitting ? 'Drawing...' : 'Send'}
                    </button>
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
    );
  }