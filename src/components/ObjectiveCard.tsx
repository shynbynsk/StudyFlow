import React, { useState } from 'react';
import { StudyObjective, ObjectiveStatus } from '../types/objective';
import { formatDeadlinePtBr, getDeadlineInfo } from '../utils/date';
import { STATUS_LABELS } from '../utils/initialData';
import { 
  Calendar, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Timer,
  Check
} from 'lucide-react';

interface ObjectiveCardProps {
  objective: StudyObjective;
  onEdit: (objective: StudyObjective) => void;
  onDelete: (id: string, title: string) => void;
  onStatusChange: (id: string, newStatus: ObjectiveStatus) => void;
  onToggleSubtask?: (objectiveId: string, subtaskId: string) => void;
  onStartFocus?: (objective: StudyObjective) => void;
}

export const ObjectiveCard: React.FC<ObjectiveCardProps> = ({
  objective,
  onEdit,
  onDelete,
  onStatusChange,
  onToggleSubtask,
  onStartFocus
}) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const deadlineInfo = getDeadlineInfo(objective.deadline, objective.status);

  const subtasks = objective.subtasks || [];
  const completedSubtasks = subtasks.filter(s => s.completed).length;
  const subtasksPercent = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;

  const isCompleted = objective.status === 'concluido';

  return (
    <article 
      className={`bg-white border rounded-xl p-5 transition-all duration-200 hover:shadow-sm ${
        isCompleted 
          ? 'border-slate-200 bg-slate-50/50 opacity-90' 
          : deadlineInfo.isOverdue 
            ? 'border-rose-200' 
            : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Header row: Category / Meta unboxed text & Actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Metadata unboxed text with typographic separators (anti-slop) */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5 flex-wrap">
            {objective.category && (
              <>
                <span className="font-medium text-indigo-600">{objective.category}</span>
                <span aria-hidden="true">·</span>
              </>
            )}
            {objective.priority && (
              <>
                <span className={`capitalize ${
                  objective.priority === 'alta' ? 'text-amber-700 font-medium' : ''
                }`}>
                  Prioridade {objective.priority}
                </span>
                <span aria-hidden="true">·</span>
              </>
            )}
            <span className="text-slate-400">
              Criado em {new Date(objective.createdAt).toLocaleDateString('pt-BR')}
            </span>
          </div>

          {/* Title */}
          <h3 className={`text-base font-semibold text-slate-900 leading-snug break-words ${
            isCompleted ? 'line-through text-slate-500' : ''
          }`}>
            {objective.title}
          </h3>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {onStartFocus && !isCompleted && (
            <button
              onClick={() => onStartFocus(objective)}
              title="Iniciar Foco (Pomodoro 25min)"
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <Timer className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onEdit(objective)}
            title="Editar objetivo"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(objective.id, objective.title)}
            title="Excluir objetivo"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 mt-2.5 leading-relaxed break-words whitespace-pre-line">
        {objective.description || <span className="italic text-slate-400">Sem descrição detalhada.</span>}
      </p>

      {/* Subtasks (Micro-passos para iniciantes) */}
      {subtasks.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <button
              onClick={() => setShowSubtasks(!showSubtasks)}
              className="flex items-center gap-1.5 font-medium hover:text-slate-900 transition-colors cursor-pointer"
            >
              <span>Etapas ({completedSubtasks}/{subtasks.length})</span>
              {showSubtasks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <span className="font-mono tabular-nums">{subtasksPercent}% concluído</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-2">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${subtasksPercent}%` }}
            />
          </div>

          {showSubtasks && (
            <ul className="space-y-1.5 mt-2 pl-0.5">
              {subtasks.map((task) => (
                <li key={task.id} className="flex items-start gap-2 text-xs">
                  <button
                    onClick={() => onToggleSubtask && onToggleSubtask(objective.id, task.id)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 cursor-pointer"
                  >
                    {task.completed ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-slate-300" />
                    )}
                  </button>
                  <span className={task.completed ? 'line-through text-slate-400' : 'text-slate-700'}>
                    {task.title}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Footer Info: Prazo & Status Selector */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Prazo */}
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500">Prazo:</span>
          <span className="font-medium text-slate-800 font-mono tabular-nums">
            {formatDeadlinePtBr(objective.deadline)}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className={`font-medium ${
            deadlineInfo.isOverdue 
              ? 'text-rose-600 font-semibold' 
              : deadlineInfo.isToday 
                ? 'text-amber-600 font-semibold'
                : 'text-slate-500'
          }`}>
            {deadlineInfo.label}
          </span>
        </div>

        {/* Status Dropdown/Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor={`status-${objective.id}`} className="text-slate-400 sr-only">
            Status
          </label>
          <select
            id={`status-${objective.id}`}
            value={objective.status}
            onChange={(e) => onStatusChange(objective.id, e.target.value as ObjectiveStatus)}
            className={`text-xs font-medium rounded-lg px-2.5 py-1.5 border transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
              objective.status === 'concluido'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : objective.status === 'em_andamento'
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : objective.status === 'pausado'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <option value="nao_iniciado">Não iniciado</option>
            <option value="em_andamento">Em andamento</option>
            <option value="concluido">Concluído</option>
            <option value="pausado">Pausado</option>
          </select>
        </div>
      </div>
    </article>
  );
};
