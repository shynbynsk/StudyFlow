import React from 'react';
import { Badge } from '../types/badge';
import { Trophy, X, ArrowRight, Award, Sparkles } from 'lucide-react';

interface BadgesBannerProps {
  unlockedBadge: Badge | null;
  onDismiss: () => void;
  onViewAll: () => void;
}

export const BadgesBanner: React.FC<BadgesBannerProps> = ({
  unlockedBadge,
  onDismiss,
  onViewAll
}) => {
  if (!unlockedBadge) return null;

  return (
    <div 
      className="bg-indigo-900 text-white border-b border-indigo-800 shadow-md transition-all animate-in slide-in-from-top-4 duration-300"
      role="region"
      aria-label="Conquista Desbloqueada"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left info */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-indigo-950 flex items-center justify-center font-bold shrink-0 shadow-sm">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Nova Conquista Desbloqueada!
                </span>
              </div>
              <h4 className="text-sm font-bold text-white leading-tight">
                {unlockedBadge.title}
              </h4>
              <p className="text-xs text-indigo-200 mt-0.5 line-clamp-1">
                {unlockedBadge.description}
              </p>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              onClick={onViewAll}
              className="px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 active:bg-white/30 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Ver Minhas Conquistas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onDismiss}
              className="p-1.5 text-indigo-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              aria-label="Fechar aviso de conquista"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
