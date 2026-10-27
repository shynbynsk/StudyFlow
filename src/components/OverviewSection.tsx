import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { StudyObjective, ObjectiveStatus } from '../types/objective';
import { getDeadlineInfo } from '../utils/date';
import { 
  Target, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Trophy, 
  PieChart as PieChartIcon 
} from 'lucide-react';

interface OverviewSectionProps {
  objectives: StudyObjective[];
  selectedStatusFilter: 'all' | ObjectiveStatus;
  onSelectStatusFilter: (status: 'all' | ObjectiveStatus) => void;
  unlockedBadgesCount: number;
  totalBadgesCount: number;
  onOpenBadges: () => void;
}

const STATUS_CONFIG: Record<
  ObjectiveStatus, 
  { label: string; color: string; hoverColor: string; bgClass: string; textClass: string; borderClass: string }
> = {
  nao_iniciado: {
    label: 'Não iniciado',
    color: '#94a3b8', // slate-400
    hoverColor: '#64748b',
    bgClass: 'bg-slate-100',
    textClass: 'text-slate-700',
    borderClass: 'border-slate-200'
  },
  em_andamento: {
    label: 'Em andamento',
    color: '#3b82f6', // blue-500
    hoverColor: '#2563eb',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200'
  },
  pausado: {
    label: 'Pausado',
    color: '#f59e0b', // amber-500
    hoverColor: '#d97706',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200'
  },
  concluido: {
    label: 'Concluído',
    color: '#10b981', // emerald-500
    hoverColor: '#059669',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200'
  }
};

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  objectives,
  selectedStatusFilter,
  onSelectStatusFilter,
  unlockedBadgesCount,
  totalBadgesCount,
  onOpenBadges
}) => {
  const total = objectives.length;
  const completed = objectives.filter(o => o.status === 'concluido').length;
  const inProgress = objectives.filter(o => o.status === 'em_andamento').length;
  const paused = objectives.filter(o => o.status === 'pausado').length;
  const notStarted = objectives.filter(o => o.status === 'nao_iniciado').length;

  const urgentCount = objectives.filter(o => {
    if (o.status === 'concluido') return false;
    const info = getDeadlineInfo(o.deadline, o.status);
    return info.isUrgent;
  }).length;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Prepare chart data for Recharts
  const chartData = [
    {
      id: 'concluido' as ObjectiveStatus,
      name: STATUS_CONFIG.concluido.label,
      value: completed,
      color: STATUS_CONFIG.concluido.color
    },
    {
      id: 'em_andamento' as ObjectiveStatus,
      name: STATUS_CONFIG.em_andamento.label,
      value: inProgress,
      color: STATUS_CONFIG.em_andamento.color
    },
    {
      id: 'nao_iniciado' as ObjectiveStatus,
      name: STATUS_CONFIG.nao_iniciado.label,
      value: notStarted,
      color: STATUS_CONFIG.nao_iniciado.color
    },
    {
      id: 'pausado' as ObjectiveStatus,
      name: STATUS_CONFIG.pausado.label,
      value: paused,
      color: STATUS_CONFIG.pausado.color
    }
  ].filter(item => item.value > 0);

  // Custom clean tooltip for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = total > 0 ? Math.round((data.value / total) * 100) : 0;
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs shadow-lg border border-slate-800">
          <div className="font-semibold">{data.name}</div>
          <div className="text-slate-300 font-mono tabular-nums mt-0.5">
            {data.value} {data.value === 1 ? 'objetivo' : 'objetivos'} ({percent}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-2xs">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <PieChartIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Visão Geral dos Estudos</h2>
            <p className="text-xs text-slate-500">
              Distribuição do status e progresso de todos os seus objetivos de estudo.
            </p>
          </div>
        </div>

        {/* Badges Quick Button */}
        <button
          onClick={onOpenBadges}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border border-amber-200 rounded-lg transition-colors cursor-pointer"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-600" />
          <span>{unlockedBadgesCount}/{totalBadgesCount} Conquistas Desbloqueadas</span>
        </button>
      </div>

      {/* Main Grid: Chart + Distribution Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-6">
        {/* Left Column: Recharts Pie Chart (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          {total === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-2">
                <PieChartIcon className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-500 font-medium">Nenhum dado para exibir no gráfico</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Cadastre objetivos para ver a distribuição</p>
            </div>
          ) : (
            <div className="relative w-full max-w-[280px] h-56 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                    cursor="pointer"
                    onClick={(data: any) => {
                      const statusId = data?.payload?.id || data?.id;
                      if (statusId) {
                        onSelectStatusFilter(statusId as ObjectiveStatus);
                      }
                    }}
                  >
                    {chartData.map((entry) => (
                      <Cell 
                        key={`cell-${entry.id}`} 
                        fill={entry.color} 
                        stroke="#ffffff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 leading-none">
                  {total}
                </span>
                <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-1">
                  {total === 1 ? 'Objetivo' : 'Objetivos'}
                </span>
              </div>
            </div>
          )}

          {/* Overall Completion Bar */}
          <div className="w-full max-w-xs mt-2 px-2">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
              <span className="text-[11px] font-medium text-slate-500">Taxa de Conclusão</span>
              <span className="font-mono tabular-nums font-bold text-slate-800">{percentage}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Status Cards / Legend (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            {/* Concluído Card */}
            <button
              onClick={() => onSelectStatusFilter(selectedStatusFilter === 'concluido' ? 'all' : 'concluido')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedStatusFilter === 'concluido'
                  ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-400/20 shadow-xs'
                  : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">Concluídos</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono tabular-nums text-emerald-700">
                  {completed}
                </span>
                <span className="text-[11px] font-mono tabular-nums text-slate-500">
                  {total > 0 ? Math.round((completed / total) * 100) : 0}%
                </span>
              </div>
            </button>

            {/* Em andamento Card */}
            <button
              onClick={() => onSelectStatusFilter(selectedStatusFilter === 'em_andamento' ? 'all' : 'em_andamento')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedStatusFilter === 'em_andamento'
                  ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-400/20 shadow-xs'
                  : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">Em andamento</span>
                </div>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono tabular-nums text-blue-700">
                  {inProgress}
                </span>
                <span className="text-[11px] font-mono tabular-nums text-slate-500">
                  {total > 0 ? Math.round((inProgress / total) * 100) : 0}%
                </span>
              </div>
            </button>

            {/* Não iniciado Card */}
            <button
              onClick={() => onSelectStatusFilter(selectedStatusFilter === 'nao_iniciado' ? 'all' : 'nao_iniciado')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedStatusFilter === 'nao_iniciado'
                  ? 'bg-slate-200/80 border-slate-400 ring-2 ring-slate-400/20 shadow-xs'
                  : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-slate-400 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">Não iniciados</span>
                </div>
                <Target className="w-4 h-4 text-slate-500" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono tabular-nums text-slate-700">
                  {notStarted}
                </span>
                <span className="text-[11px] font-mono tabular-nums text-slate-500">
                  {total > 0 ? Math.round((notStarted / total) * 100) : 0}%
                </span>
              </div>
            </button>

            {/* Pausado Card */}
            <button
              onClick={() => onSelectStatusFilter(selectedStatusFilter === 'pausado' ? 'all' : 'pausado')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedStatusFilter === 'pausado'
                  ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                  : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">Pausados</span>
                </div>
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-bold font-mono tabular-nums text-amber-700">
                  {paused}
                </span>
                <span className="text-[11px] font-mono tabular-nums text-slate-500">
                  {total > 0 ? Math.round((paused / total) * 100) : 0}%
                </span>
              </div>
            </button>
          </div>

          {/* Attention alert indicator */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              💡 <em>Dica:</em> Clique em qualquer fatia ou cartão para filtrar a lista.
            </span>
            {urgentCount > 0 && (
              <span className="text-amber-700 font-semibold flex items-center gap-1 font-mono tabular-nums">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                {urgentCount} com prazo próximo
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
