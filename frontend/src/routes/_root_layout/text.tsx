import { generateSvgFromPromptApiV1SvgGenerateFromPromptPostMutation } from '@/client/@tanstack/react-query.gen';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/_root_layout/text')({
  component: RouteComponent,
})

function RouteComponent() {
    const [inputText, setInputText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const mutation = useMutation({
        ...generateSvgFromPromptApiV1SvgGenerateFromPromptPostMutation()
    })
    
    // Function to handle text submission
    const handleSubmit = async () => {
      if (!inputText.trim()) return;
      
      setIsSubmitting(true);
      
      try {
        
        console.log('Sending text to endpoint:', inputText);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Handle response here
        
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
          {/* Text Input Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Generate an SVG from your text input</h2>
              
              <div className="flex flex-col gap-4">
                {/* Text Area */}
                <div>
                  <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter your text
                  </label>
                  <textarea
                    id="text-input"
                    className="w-full min-h-40 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y"
                    placeholder="Type something to convert to SVG..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  ></textarea>
                </div>
                
                {/* Settings or options could go here */}
                
                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    className={`px-4 py-2 rounded-md text-white ${
                      isSubmitting 
                        ? 'bg-blue-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    onClick={handleSubmit}
                    disabled={isSubmitting || !inputText.trim()}
                  >
                    {isSubmitting ? 'Generating...' : 'Generate SVG'}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Result area could be added here */}
          
        </main>
      </div>
    );
  }
