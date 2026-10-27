import React from 'react';
import { StudyObjective } from '../types/objective';
import { getDeadlineInfo } from '../utils/date';
import { Target, CheckCircle2, Clock, AlertCircle, Trophy } from 'lucide-react';

interface StatsBannerProps {
  objectives: StudyObjective[];
  unlockedBadgesCount?: number;
  totalBadgesCount?: number;
  onOpenBadges?: () => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ 
  objectives,
  unlockedBadgesCount = 0,
  totalBadgesCount = 8,
  onOpenBadges
}) => {
  const total = objectives.length;
  const completed = objectives.filter(o => o.status === 'concluido').length;
  const inProgress = objectives.filter(o => o.status === 'em_andamento').length;
  
  const urgentCount = objectives.filter(o => {
    if (o.status === 'concluido') return false;
    const info = getDeadlineInfo(o.deadline, o.status);
    return info.isUrgent;
  }).length;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-slate-900">Seu Progresso de Estudos</h2>
            {onOpenBadges && (
              <button
                onClick={onOpenBadges}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                title="Abrir quadro de conquistas"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-600" />
                <span>{unlockedBadgesCount} / {totalBadgesCount} Conquistas</span>
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Mantenha o foco em um objetivo por vez para construir consistência diária.
          </p>
          
          <div className="mt-3 flex items-center gap-3">
            <div className="w-48 sm:w-64 bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-700 font-mono tabular-nums">
              {percentage}% concluído
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Total</div>
              <div className="text-lg font-bold text-slate-900 font-mono tabular-nums">{total}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Em andamento</div>
              <div className="text-lg font-bold text-blue-700 font-mono tabular-nums">{inProgress}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Concluídos</div>
              <div className="text-lg font-bold text-emerald-700 font-mono tabular-nums">{completed}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              urgentCount > 0 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'
            }`}>
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Atenção ao prazo</div>
              <div className={`text-lg font-bold font-mono tabular-nums ${urgentCount > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
                {urgentCount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
