import { createFileRoute } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query';
import { generateSvgFromPromptApiV1SvgGenerateFromPromptPostMutation } from '@/client/@tanstack/react-query.gen';
import { Button } from '@/components/ui/button'
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
      query: {
        token: "ersatztoken",
        md_text: speech
      }
  })
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
      <Button onClick={()=>handleSpeechInput(transcript)}>SendToRobot</Button>
      <p>{transcript}</p>
    </div>
  );
}


