import React, { useState, useEffect } from 'react';
import { StudyObjective } from '../types/objective';
import { Play, Pause, RotateCcw, X, CheckCircle } from 'lucide-react';

interface FocusTimerModalProps {
  isOpen: boolean;
  objective: StudyObjective | null;
  onClose: () => void;
  onMarkCompleted: (id: string) => void;
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

  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

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
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
          Sessão de Foco Pomodoro
        </span>
        <h3 className="text-base font-bold text-slate-900 mt-1 line-clamp-1">
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
          <p className="text-xs text-slate-400 mt-2">
            {isActive ? 'Foco ativo...' : secondsLeft === 0 ? 'Tempo concluído! Descanse 5 minutos.' : 'Pronto para começar'}
          </p>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={resetTimer}
            className="p-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Reiniciar 25min"
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
