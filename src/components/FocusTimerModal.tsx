import React, { useState, useEffect } from 'react';
import { StudyObjective } from '../types/objective';
import { Play, Pause, RotateCcw, X, CheckCircle, Bell } from 'lucide-react';

interface FocusTimerModalProps {
  isOpen: boolean;
  objective: StudyObjective | null;
  onClose: () => void;
  onMarkCompleted: (id: string) => void;
}

function playCompletionChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // Gentle harmonious two-tone chime (E5 -> A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.25);
    gain2.gain.setValueAtTime(0.2, now + 0.25);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.25);
    osc2.stop(now + 0.85);
  } catch {
    // Graceful fallback if audio context is blocked
  }
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  objective,
  onClose,
  onMarkCompleted
}) => {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(25 * 60);
      setIsActive(false);
    }
  }, [isOpen, objective]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Accurate timer interval without rebuilding every second
  useEffect(() => {
    if (!isActive) return;

    const intervalId = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          playCompletionChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isActive]);

  if (!isOpen || !objective) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(25 * 60);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl border border-slate-200 max-w-sm w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150 text-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="focus-modal-title"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Fechar temporizador de foco"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          Sessão de Foco Pomodoro
        </span>
        <h3 id="focus-modal-title" className="text-base font-bold text-slate-900 mt-1 line-clamp-1">
          {objective.title}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          25 minutos de atenção plena, sem distrações.
        </p>

        {/* Big Timer Display */}
        <div className="my-8">
          <div className="text-5xl font-mono font-bold tracking-tight text-slate-900 tabular-nums">
            {formattedTime}
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center justify-center gap-1.5">
            {isActive ? (
              <span className="text-indigo-600 font-medium">Foco ativo...</span>
            ) : secondsLeft === 0 ? (
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <Bell className="w-3.5 h-3.5" />
                Tempo concluído! Descanse 5 minutos.
              </span>
            ) : (
              <span>Pronto para começar</span>
            )}
          </p>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={resetTimer}
            className="p-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Reiniciar 25min"
            aria-label="Reiniciar 25 minutos"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium rounded-xl transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            {isActive ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>{secondsLeft === 25 * 60 ? 'Iniciar Foco' : 'Continuar'}</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center">
          <button
            onClick={() => {
              onMarkCompleted(objective.id);
              onClose();
            }}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Finalizei este objetivo agora!</span>
          </button>
        </div>
      </div>
    </div>
  );
};
