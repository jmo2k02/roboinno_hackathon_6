import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query';
import { generateSvgFromPromptApiV1SvgGenerateSvgFromPromptPostMutation } from '@/client/@tanstack/react-query.gen';
import { Button } from '@/components/ui/button'
import { Bell,Send, RotateCcw, SendHorizontal, Mic, Home, Menu, MessageSquare, MicVocal, PencilRuler, UserCircle, View } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
export const Route = createFileRoute('/_root_layout/voice')({
  component: RouteComponent,
})

/*
const Dictaphone = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div>
      <p>Microphone: {listening ? 'on' : 'off'}</p>
      <Button onClick={()=>SpeechRecognition.startListening({continuous :true})}>Start</Button>
      <Button onClick={SpeechRecognition.stopListening}>Stop</Button>
      <Button onClick={resetTranscript}>Reset</Button>
      <Button onClick={handleSpeechInput}>SendToRobot</Button>
      <p>{transcript}</p>
    </div>
  );
};
export default Dictaphone;*/


function RouteComponent() {
  const mutation = useMutation({
    ...generateSvgFromPromptApiV1SvgGenerateSvgFromPromptPostMutation()
  })

  const handleSpeechInput = (speech: string) =>
    mutation.mutate({
      body:{text: speech},
      query: {
        token: "ersatztoken",
      }
  })

  const toggleMic=(turnedOn:boolean)=>{
    if(turnedOn){
      SpeechRecognition.stopListening()
    }else{
      SpeechRecognition.startListening({continuous :true})}
    } 

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  
  
  

  

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
    <h3 className="font-medium mb-2">Voice recognition</h3>
    <p className="text-gray-600 text-sm mb-4">Speak to control your robot with voice commands</p>
    
    <div className="bg-gray-50 rounded-md p-4 mb-4">
      <div className="flex items-center gap-3 mb-4">
        <button 
          onClick={() => toggleMic(listening)} 
          className={`flex items-center justify-center p-2 rounded-md transition-colors duration-200 ${
            listening 
              ? "bg-blue-600 text-white" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          aria-label={listening ? "Stop recording" : "Start recording"}
        >    
          <Mic size={18} />
        </button>

        <button 
          onClick={resetTranscript}
          className="flex items-center justify-center p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-200"
          aria-label="Reset transcript"
        >
          <RotateCcw size={18} />
        </button>
        
        <button 
          onClick={() => handleSpeechInput(transcript)}
          className="flex-grow flex items-center justify-center py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
          aria-label="Send message"
          disabled={!transcript}
        >
          <SendHorizontal size={16} className="mr-2" /> 
          Send Prompt
        </button>
      </div>
      
      <div className={`p-3 bg-white rounded-md border border-gray-200 min-h-12 ${transcript ? '' : 'text-gray-400'}`}>
        {transcript || "Transcript will appear here..."}
      </div>
    </div>
    
    
  </div>
);

}


