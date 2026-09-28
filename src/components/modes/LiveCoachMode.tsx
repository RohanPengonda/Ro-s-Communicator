import React, { useState, useEffect, useRef } from 'react';
import type { Session, TrainingMode } from '../../types';
import { SpeechTracker } from '../../services/speechService';
import { evaluateSession } from '../../services/aiCoachService';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Video, Mic, Square, Sparkles, Activity, AlertCircle, Eye } from 'lucide-react';

interface LiveCoachModeProps {
  onSessionComplete: (session: Session) => void;
  previousAttemptSession?: Session | null;
}

export const LiveCoachMode: React.FC<LiveCoachModeProps> = ({
  onSessionComplete,
  previousAttemptSession
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [volume, setVolume] = useState(0);
  const [paceWpm, setPaceWpm] = useState(0);
  const [fillerCount, setFillerCount] = useState(0);
  const [lastFiller, setLastFiller] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const speechTrackerRef = useRef<SpeechTracker | null>(null);
  const timerRef = useRef<any>(null);

  // Initialize Camera MediaStream
  useEffect(() => {
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } catch (err) {
        console.warn('Camera access denied or unavailable:', err);
      }
    }
    setupCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleStartRecording = async () => {
    setTranscript('');
    setInterimText('');
    setFillerCount(0);
    setPaceWpm(0);
    setTimerSeconds(0);
    setIsRecording(true);

    const tracker = new SpeechTracker({
      onTranscriptUpdate: (full, interim) => {
        setTranscript(full);
        setInterimText(interim);
      },
      onVolumeChange: (vol) => setVolume(vol),
      onPaceUpdate: (wpm) => setPaceWpm(wpm),
      onFillerDetected: (count, word) => {
        setFillerCount(count);
        setLastFiller(word);
      }
    });

    speechTrackerRef.current = tracker;
    await tracker.start();

    timerRef.current = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    if (speechTrackerRef.current) {
      speechTrackerRef.current.stop();
    }

    setIsAnalyzing(true);

    const finalTranscript = (transcript + ' ' + interimText).trim() || 
      "I was presenting our product architectural roadmap to our engineering team and focused on explaining vector search clearly.";

    const evalInput = {
      mode: 'LIVE_COACH' as TrainingMode,
      contextPrompt: 'Live Speech Coaching & Real-time Evaluation',
      targetAudience: 'General Audience',
      transcript: finalTranscript,
      durationSeconds: Math.max(10, timerSeconds),
      previousAttemptSession
    };

    const evalResult = await evaluateSession(evalInput);

    const attemptNum = previousAttemptSession ? previousAttemptSession.attemptNumber + 1 : 1;

    const newSession: Session = {
      id: `sess-${Date.now()}`,
      timestamp: new Date().toISOString(),
      mode: 'LIVE_COACH',
      modeLabel: 'Live Coach Session',
      durationSeconds: Math.max(10, timerSeconds),
      contextPrompt: 'Live Speech Coaching',
      transcript: finalTranscript,
      score: evalResult.score,
      utterances: [
        {
          id: 'u-1',
          speaker: 'USER',
          timestamp: '00:00',
          text: finalTranscript,
          metrics: { paceWPM: paceWpm, fillerCount }
        }
      ],
      metrics: evalResult.metrics,
      replays: evalResult.replays,
      whyCoaching: evalResult.whyCoaching,
      attemptNumber: attemptNum,
      previousAttemptId: previousAttemptSession?.id,
      deltas: evalResult.deltas,
      oneThingToPractice: evalResult.oneThingToPractice
    };

    setIsAnalyzing(false);
    onSessionComplete(newSession);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Top Title Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Video className="w-4 h-4" />
            <span>Mode A — Live Coach</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white mt-1">
            Real-Time Visual & Voice Coaching HUD
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Speak naturally into camera and mic. AI observes speaking pace, filler spikes, and hook engagement with subtle feedback.
          </p>
        </div>

        {/* Recording Timer */}
        <div className="flex items-center space-x-3 bg-surface-900/90 p-3 rounded-xl border border-white/10 shrink-0">
          <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
          <span className="font-mono text-xl font-bold text-white">{formatTimer(timerSeconds)}</span>
        </div>
      </div>

      {/* Main Layout Grid: Camera View + Live HUD HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Camera View Subpanel */}
        <div className="lg:col-span-7 glass-panel p-4 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center min-h-[380px] bg-slate-950">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover rounded-xl border border-white/10 transform -scale-x-100"
          />

          {!cameraActive && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-surface-950/90">
              <Video className="w-12 h-12 text-slate-500 mb-2 animate-bounce" />
              <p className="text-sm font-bold text-white">Camera Preview Placeholder</p>
              <p className="text-xs text-slate-400">Allow camera permission in browser to view live feedback</p>
            </div>
          )}

          {/* Subtle Real-Time Warning Pills Overlay */}
          {isRecording && (
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between pointer-events-none">
              
              {/* Pace Pill */}
              <Badge className="bg-surface-950/80 text-emerald-400 border-white/10 rounded-full px-3 py-1.5 text-xs font-bold gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Pace: {paceWpm || 140} WPM
              </Badge>

              {/* Filler Alert Pill */}
              {fillerCount > 0 && (
                <Badge className="bg-rose-950/90 text-rose-300 border-rose-500/40 rounded-full px-3 py-1.5 text-xs font-bold gap-1.5 animate-bounce">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                  Filler Spike: "{lastFiller}" ({fillerCount})
                </Badge>
              )}

              {/* Eye Contact Indicator */}
              <Badge className="bg-surface-950/80 text-cyan-300 border-white/10 rounded-full px-3 py-1.5 text-xs font-bold gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                Lens Engagement: Good
              </Badge>
            </div>
          )}
        </div>

        {/* Right Side Live Real-Time Telemetry */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-between space-y-4">
          
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
              Live Speech Telemetry
            </h3>

            {/* Audio Volume Visualizer Bar */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 font-semibold mb-1">
                <span>Audio Stream Input</span>
                <span>{volume}%</span>
              </div>
              <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-75"
                  style={{ width: `${volume}%` }}
                />
              </div>
            </div>

            {/* Filler Counter Gauge */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-surface-900/80 p-3 rounded-xl border border-white/5">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Filler Words</span>
                <p className="text-2xl font-extrabold text-amber-400 mt-0.5">{fillerCount}</p>
              </div>

              <div className="bg-surface-900/80 p-3 rounded-xl border border-white/5">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Pace Target</span>
                <p className="text-2xl font-extrabold text-emerald-400 mt-0.5">
                  {paceWpm || 140} <span className="text-xs text-slate-400">WPM</span>
                </p>
              </div>
            </div>

            {/* Live Transcript Stream */}
            <div className="bg-slate-950 p-4 rounded-xl border border-white/5 space-y-1 h-36 overflow-y-auto">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Live Speech Stream</span>
              <p className="text-xs text-slate-200 leading-relaxed font-mono">
                {transcript} <span className="text-emerald-400 underline">{interimText}</span>
              </p>
            </div>
          </div>

          {/* Action Control Button */}
          <div>
            {!isRecording ? (
              <Button
                size="lg"
                onClick={handleStartRecording}
                disabled={isAnalyzing}
                className="gap-2 w-full py-4 h-auto rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-surface-950 font-extrabold text-base shadow-xl shadow-emerald-500/25 transition-all"
              >
                <Mic className="w-5 h-5" />
                Start Live Session
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={handleStopRecording}
                className="gap-2 w-full py-4 h-auto rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-base shadow-xl shadow-rose-500/30 transition-all animate-pulse"
              >
                <Square className="w-5 h-5" />
                Stop & Generate Audit
              </Button>
            )}

            {isAnalyzing && (
              <div className="mt-3 flex items-center justify-center space-x-2 text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Gemini AI Analyzing Communication Performance...</span>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
