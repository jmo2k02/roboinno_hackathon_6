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
function postVoicetoText(text: string): Promise<void>{
  // Since this request will send JSON data in the body,
  // we need to set the `Content-Type` header to `application/json`
  const headers: Headers = new Headers()
  headers.set('queries', 'application/json')
  headers.set('token', '712947291537182')

  const body: BodyInit = text
  const request: RequestInfo = new Request('/generate_from_prompt', {
    // We need to set the `method` to `POST` and assign the headers
    method: 'POST',
    headers: headers,
    // Convert the user object to JSON and pass it as the body
    body: body
  })

  // Send the request and print the response
  return fetch(request)
    .then(res => {
      console.log("got response:", res)
    })
}
