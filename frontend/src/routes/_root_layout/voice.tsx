import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query';
import { generateSvgFromPromptApiV1SvgGenerateFromPromptPostMutation } from '@/client/@tanstack/react-query.gen';
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
    ...generateSvgFromPromptApiV1SvgGenerateFromPromptPostMutation()
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
    <div className="flex-1 pt-4">
      <div className='bg-blue-600 text-white px-4 py-2 rounded-md flex items-center'>
        
        <button onClick={()=>toggleMic(listening)} 
          className='bg-blue-600 text-white px-2 py-2 rounded-md hover:bg-blue-700 flex items-center'
          style={listening?{ color: "White", backgroundColor: "DarkBlue"}: { color: "Black", backgroundColor: "white"}}
        >    
            <Mic size={200}/> 
        </button>

        <button onClick={resetTranscript}
          className='bg-white-600 text-black px-4 py-2 rounded-md hover:bg-blue-700 flex items-center'
        >
          <RotateCcw size={200}/>
        </button>
        <button onClick={()=>handleSpeechInput(transcript)}
          className='bg-white-600 text-black px-4 py-2 rounded-md hover:bg-blue-700 flex items-center'  
        >
          <SendHorizontal size={200}/> 
        </button>
      </div>
      
        <text style={{fontSize: 20}}>{transcript}</text>
      
      
    </div>
  );
}


