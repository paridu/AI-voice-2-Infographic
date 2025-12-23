import React, { useState, useEffect, useRef } from 'react';
import { VoiceService } from '../services/voiceService';

interface Props {
  onTranscript: (text: string) => void;
  isProcessing: boolean;
}

export const VoiceControl: React.FC<Props> = ({ onTranscript, isProcessing }) => {
  const [isListening, setIsListening] = useState(false);
  const voiceService = useRef<VoiceService | null>(null);

  useEffect(() => {
    voiceService.current = new VoiceService(
      (text) => {
        onTranscript(text);
        setIsListening(false);
      },
      () => setIsListening(false),
      (err) => {
        console.error("Voice error:", err);
        setIsListening(false);
      }
    );
  }, [onTranscript]);

  const toggleListen = () => {
    if (isListening) {
      voiceService.current?.stop();
    } else {
      voiceService.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={toggleListen}
        disabled={isProcessing}
        className={`
          relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300
          ${isListening 
            ? 'bg-red-500 shadow-[0_0_0_8px_rgba(239,68,68,0.3)] animate-pulse' 
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {isListening ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H9a1 1 0 01-1-1v-4z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>
      <span className="text-sm font-medium text-slate-500">
        {isListening ? 'กำลังฟัง...' : 'แตะเพื่อพูด'}
      </span>
    </div>
  );
};