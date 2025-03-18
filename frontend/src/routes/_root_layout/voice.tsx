import { createFileRoute } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
export const Route = createFileRoute('/_root_layout/voice')({
  component: RouteComponent,
})


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
      <p>{transcript}</p>
    </div>
  );
};
export default Dictaphone;


function RouteComponent() {
  return <Dictaphone/>
}
