import React from 'react';
import { Badge } from '../types/badge';
import { 
  Trophy, 
  X, 
  Check, 
  Lock, 
  Flag, 
  Target, 
  Layers, 
  Flame, 
  Clock, 
  Sparkles,
  Award
} from 'lucide-react';

interface BadgesModalProps {
  isOpen: boolean;
  badges: Badge[];
  onClose: () => void;
}

const BADGE_ICONS: Record<string, React.ElementType> = {
  flag: Flag,
  target: Target,
  check: Check,
  trophy: Trophy,
  flame: Flame,
  layers: Layers,
  clock: Clock
};

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  badges,
  onClose
}) => {
  if (!isOpen) return null;

  const unlockedCount = badges.filter(b => b.unlockedAt !== null).length;
  const totalCount = badges.length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="badges-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 id="badges-modal-title" className="text-lg font-bold text-slate-900">
                Quadro de Conquistas do Estudante
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Marcos educacionais para celebrar sua consistência e evolução diária.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview progress bar */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 my-4 shrink-0">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
            <span className="font-semibold text-slate-800">
              Progresso Geral: {unlockedCount} de {totalCount} Conquistas
            </span>
            <span className="font-mono tabular-nums font-semibold text-indigo-600">
              {completionPercent}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>

        {/* Badges Grid */}
        <div className="overflow-y-auto pr-1 space-y-3 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badges.map((badge) => {
              const isUnlocked = Boolean(badge.unlockedAt);
              const IconComponent = BADGE_ICONS[badge.iconName] || Trophy;

              return (
                <div
                  key={badge.id}
                  className={`border rounded-xl p-3.5 transition-all flex flex-col justify-between ${
                    isUnlocked
                      ? 'bg-amber-50/40 border-amber-200/80 shadow-2xs'
                      : 'bg-white border-slate-200 opacity-75'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div 
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isUnlocked 
                          ? 'bg-amber-400 text-amber-950 shadow-xs' 
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isUnlocked ? (
                        <IconComponent className="w-4 h-4" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className={`text-xs font-bold leading-tight ${
                          isUnlocked ? 'text-slate-900' : 'text-slate-700'
                        }`}>
                          {badge.title}
                        </h4>
                        {isUnlocked && (
                          <span className="text-[10px] text-amber-700 font-medium bg-amber-100/70 px-1.5 py-0.2 rounded">
                            Conquistado
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>

                  {/* Progress or unlock date */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    {isUnlocked ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Desbloqueado</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 font-mono tabular-nums">
                        {badge.progress.label}
                      </span>
                    )}

                    {badge.unlockedAt && (
                      <span className="text-slate-400 text-[10px]">
                        {new Date(badge.unlockedAt).toLocaleDateString('pt-BR')}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
