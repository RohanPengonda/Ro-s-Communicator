// Web Speech API interface declarations
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

export interface SpeechTrackerCallbacks {
  onTranscriptUpdate: (fullTranscript: string, interimText: string) => void;
  onVolumeChange: (volume: number) => void;
  onPaceUpdate: (wpm: number) => void;
  onFillerDetected: (count: number, lastFiller: string) => void;
}

export class SpeechTracker {
  private recognition: any = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private isListening = false;
  private fullTranscript = '';
  private startTime = 0;
  private fillerCount = 0;
  private animationFrameId = 0;

  private callbacks: SpeechTrackerCallbacks;

  constructor(callbacks: SpeechTrackerCallbacks) {
    this.callbacks = callbacks;
  }

  public async start(stream?: MediaStream) {
    this.fullTranscript = '';
    this.fillerCount = 0;
    this.startTime = Date.now();
    this.isListening = true;

    // 1. Web Speech Recognition Setup
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptChunk = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcriptChunk + ' ';
          } else {
            interim += transcriptChunk;
          }
        }

        if (final) {
          this.fullTranscript += final;
          this.checkFillers(final);
        }

        const currentTotal = this.fullTranscript + interim;
        this.callbacks.onTranscriptUpdate(this.fullTranscript, interim);
        this.calculatePace(currentTotal);
      };

      this.recognition.onerror = (err: SpeechRecognitionErrorEvent) => {
        console.warn('Speech recognition error:', err.error);
      };

      try {
        this.recognition.start();
      } catch (e) {
        console.warn('Speech recognition start issue:', e);
      }
    } else {
      console.warn('Web Speech API not natively supported in this browser.');
    }

    // 2. Web Audio Analyser Setup
    try {
      if (stream) {
        this.mediaStream = stream;
      } else {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      source.connect(this.analyser);

      this.monitorVolume();
    } catch (err) {
      console.warn('Could not initialize Web Audio Analyser:', err);
    }
  }

  public stop() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
  }

  private checkFillers(newText: string) {
    const fillers = /\b(um|uh|like|basically|you know|honestly|sort of|kind of)\b/gi;
    const matches = newText.match(fillers);
    if (matches && matches.length > 0) {
      this.fillerCount += matches.length;
      this.callbacks.onFillerDetected(this.fillerCount, matches[matches.length - 1]);
    }
  }

  private calculatePace(transcript: string) {
    const elapsedMinutes = (Date.now() - this.startTime) / 60000;
    if (elapsedMinutes <= 0.05) return;

    const words = transcript.trim().split(/\s+/).filter(Boolean).length;
    const wpm = Math.round(words / elapsedMinutes);
    this.callbacks.onPaceUpdate(wpm);
  }

  private monitorVolume() {
    if (!this.analyser || !this.isListening) return;

    const buffer = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(buffer);

    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i];
    }
    const average = sum / buffer.length; // 0 to 255
    const normalizedVolume = Math.min(100, Math.round((average / 128) * 100));

    this.callbacks.onVolumeChange(normalizedVolume);

    this.animationFrameId = requestAnimationFrame(() => this.monitorVolume());
  }

  public getFinalTranscript(): string {
    return this.fullTranscript;
  }
}
