

import { TestBed } from '@angular/core/testing';

import { VoiceRecognitionService } from '../services/voicetotext.service';



describe('VoiceRecognitionService', () => {
  let service: VoiceRecognitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceRecognitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
