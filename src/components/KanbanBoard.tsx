import React from 'react';
import { StudyObjective, ObjectiveStatus } from '../types/objective';
import { formatDeadlinePtBr, getDeadlineInfo } from '../utils/date';
import { Edit3, Trash2, ArrowRight, ArrowLeft, CheckCircle2, Pause, Play, Plus } from 'lucide-react';

interface KanbanBoardProps {
  objectives: StudyObjective[];
  onEdit: (objective: StudyObjective) => void;
  onDelete: (id: string, title: string) => void;
  onStatusChange: (id: string, newStatus: ObjectiveStatus) => void;
  onOpenCreate: () => void;
}

const COLUMNS: { id: ObjectiveStatus; title: string; subtitle: string; iconColor: string }[] = [
  { 
    id: 'nao_iniciado', 
    title: 'Não Iniciado', 
    subtitle: 'Planejado para começar', 
    iconColor: 'bg-slate-200 text-slate-700' 
  },
  { 
    id: 'em_andamento', 
    title: 'Em Andamento', 
    subtitle: 'Foco ativo no momento', 
    iconColor: 'bg-blue-100 text-blue-700' 
  },
  { 
    id: 'pausado', 
    title: 'Pausado', 
    subtitle: 'Aguardando ou em espera', 
    iconColor: 'bg-amber-100 text-amber-700' 
  },
  { 
    id: 'concluido', 
    title: 'Concluído', 
    subtitle: 'Metas conquistadas', 
    iconColor: 'bg-emerald-100 text-emerald-700' 
  }
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  objectives,
  onEdit,
  onDelete,
  onStatusChange,
  onOpenCreate
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
      {COLUMNS.map((col) => {
        const colObjectives = objectives.filter(o => o.status === col.id);

        return (
          <div 
            key={col.id} 
            className="bg-slate-100/70 border border-slate-200/80 rounded-xl p-4 flex flex-col min-h-[500px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    col.id === 'nao_iniciado' ? 'bg-slate-400' :
                    col.id === 'em_andamento' ? 'bg-blue-500' :
                    col.id === 'pausado' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <h3 className="text-sm font-bold text-slate-900">{col.title}</h3>
                  <span className="text-xs font-mono tabular-nums text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {colObjectives.length}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{col.subtitle}</p>
              </div>

              {col.id === 'nao_iniciado' && (
                <button
                  onClick={onOpenCreate}
                  className="p-1 hover:bg-white rounded-md text-slate-500 hover:text-indigo-600 transition-colors"
                  title="Novo objetivo nesta coluna"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Cards List */}
            <div className="space-y-3 flex-1">
              {colObjectives.length === 0 ? (
                <div className="h-32 border border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-400 text-xs p-4 text-center">
                  <span>Nenhum objetivo aqui</span>
                  {col.id === 'nao_iniciado' && (
                    <button
                      onClick={onOpenCreate}
                      className="mt-2 text-indigo-600 font-medium hover:underline"
                    >
                      + Criar primeiro
                    </button>
                  )}
                </div>
              ) : (
                colObjectives.map((obj) => {
                  const deadlineInfo = getDeadlineInfo(obj.deadline, obj.status);

                  return (
                    <div
                      key={obj.id}
                      className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs hover:border-slate-300 transition-all text-xs"
                    >
                      {/* Meta */}
                      <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 mb-1">
                        <span className="font-medium text-indigo-600 truncate">{obj.category || 'Geral'}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => onEdit(obj)}
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(obj.id, obj.title)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 className="font-semibold text-slate-900 leading-snug line-clamp-2 mb-1.5">
                        {obj.title}
                      </h4>

                      {/* Description snippet */}
                      {obj.description && (
                        <p className="text-slate-500 text-[11px] line-clamp-2 mb-2 leading-relaxed">
                          {obj.description}
                        </p>
                      )}

                      {/* Prazo */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">
                          {formatDeadlinePtBr(obj.deadline)}
                        </span>
                        <span className={deadlineInfo.isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                          {deadlineInfo.label}
                        </span>
                      </div>

                      {/* Quick Move Status Buttons */}
                      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                        {col.id !== 'nao_iniciado' && (
                          <button
                            onClick={() => onStatusChange(obj.id, 'nao_iniciado')}
                            className="px-1.5 py-0.5 rounded text-[10px] text-slate-500 hover:bg-slate-100 cursor-pointer"
                            title="Voltar para Não iniciado"
                          >
                            <ArrowLeft className="w-3 h-3 inline mr-0.5" /> Início
                          </button>
                        )}

                        {col.id !== 'em_andamento' && (
                          <button
                            onClick={() => onStatusChange(obj.id, 'em_andamento')}
                            className="px-1.5 py-0.5 rounded text-[10px] text-blue-600 hover:bg-blue-50 font-medium cursor-pointer"
                            title="Mover para Em andamento"
                          >
                            <Play className="w-3 h-3 inline mr-0.5" /> Estudar
                          </button>
                        )}

                        {col.id !== 'pausado' && col.id !== 'concluido' && (
                          <button
                            onClick={() => onStatusChange(obj.id, 'pausado')}
                            className="px-1.5 py-0.5 rounded text-[10px] text-amber-600 hover:bg-amber-50 cursor-pointer"
                            title="Pausar objetivo"
                          >
                            <Pause className="w-3 h-3 inline mr-0.5" /> Pausar
                          </button>
                        )}

                        {col.id !== 'concluido' && (
                          <button
                            onClick={() => onStatusChange(obj.id, 'concluido')}
                            className="px-1.5 py-0.5 rounded text-[10px] text-emerald-600 hover:bg-emerald-50 font-medium cursor-pointer ml-auto"
                            title="Marcar como Concluído"
                          >
                            <CheckCircle2 className="w-3 h-3 inline mr-0.5" /> Concluir
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
