import { Component } from '@angular/core';
import {VoiceRecognitionService} from '../../../../services/voicetotext.service'


@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  private toggle:boolean;
  constructor(private voiceToTextService : VoiceRecognitionService){
    this.voiceToTextService.init()
    this.toggle=false
  }
  test(){
    
    if(this.toggle){
      this.voiceToTextService.start()
      this.toggle = !this.toggle
    }else{
      this.voiceToTextService.stop()
      console.log("Hello World")
      console.log(this.voiceToTextService.text)
      this.toggle = !this.toggle
    }
    
  }
}
