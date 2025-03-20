import { useRef, useEffect } from 'react';

export function Simulator({ shouldReloadIframe, setShouldReloadIframe }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
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
  }, [shouldReloadIframe, setShouldReloadIframe]);

  return (
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
  );
}