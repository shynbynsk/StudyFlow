import React, { useState, useEffect } from 'react';
import { StudyObjective, ObjectiveStatus, Priority, Subtask } from '../types/objective';
import { X, Plus, Trash, HelpCircle } from 'lucide-react';

interface ObjectiveModalProps {
  isOpen: boolean;
  objectiveToEdit?: StudyObjective | null;
  onClose: () => void;
  onSave: (objectiveData: Omit<StudyObjective, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
}

export const ObjectiveModal: React.FC<ObjectiveModalProps> = ({
  isOpen,
  objectiveToEdit,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<ObjectiveStatus>('nao_iniciado');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('media');
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [errors, setErrors] = useState<{ title?: string; deadline?: string }>({});

  useEffect(() => {
    if (objectiveToEdit) {
      setTitle(objectiveToEdit.title);
      setDescription(objectiveToEdit.description || '');
      setDeadline(objectiveToEdit.deadline || '');
      setStatus(objectiveToEdit.status || 'nao_iniciado');
      setCategory(objectiveToEdit.category || '');
      setPriority(objectiveToEdit.priority || 'media');
      setSubtasks(objectiveToEdit.subtasks || []);
    } else {
      // Default initial date: 7 days from today
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      const formattedDefault = defaultDate.toISOString().split('T')[0];

      setTitle('');
      setDescription('');
      setDeadline(formattedDefault);
      setStatus('nao_iniciado');
      setCategory('Geral');
      setPriority('media');
      setSubtasks([]);
    }
    setErrors({});
    setNewSubtaskTitle('');
  }, [objectiveToEdit, isOpen]);

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

  if (!isOpen) return null;

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newTask: Subtask = {
      id: `sub-${Date.now()}`,
      title: newSubtaskTitle.trim(),
      completed: false
    };
    setSubtasks([...subtasks, newTask]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; deadline?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Por favor, informe o título do seu objetivo de estudo.';
    }

    if (!deadline) {
      newErrors.deadline = 'Por favor, defina um prazo para manter o foco.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: objectiveToEdit?.id,
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
      category: category.trim() || 'Geral',
      priority,
      subtasks
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 id="modal-headline" className="text-lg font-bold text-slate-900">
              {objectiveToEdit ? 'Editar Objetivo de Estudo' : 'Novo Objetivo de Estudo'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Defina com clareza o que você deseja aprender e até quando.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Título */}
          <div>
            <label htmlFor="objective-title" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Título do Objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              id="objective-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              placeholder="Ex: Aprender funções em Python, Redigir introdução do TCC..."
              className={`w-full px-3.5 py-2.5 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all ${
                errors.title ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-600'
              }`}
              autoFocus
            />
            {errors.title && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="objective-desc" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Descrição e Detalhes
            </label>
            <textarea
              id="objective-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="O que exatamente significa dominar esse conteúdo? Quais materiais ou fontes você usará?"
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>

          {/* Row: Prazo & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="objective-deadline" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Prazo Limite <span className="text-rose-500">*</span>
              </label>
              <input
                id="objective-deadline"
                type="date"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  if (errors.deadline) setErrors({ ...errors, deadline: undefined });
                }}
                className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all ${
                  errors.deadline ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-600'
                }`}
              />
              {errors.deadline && (
                <p className="text-xs text-rose-500 mt-1 font-medium">{errors.deadline}</p>
              )}
            </div>

            <div>
              <label htmlFor="objective-status" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Status Inicial
              </label>
              <select
                id="objective-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as ObjectiveStatus)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all"
              >
                <option value="nao_iniciado">Não iniciado</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluido">Concluído</option>
                <option value="pausado">Pausado</option>
              </select>
            </div>
          </div>

          {/* Row: Matéria / Categoria & Prioridade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="objective-category" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Matéria ou Tópico
              </label>
              <input
                id="objective-category"
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ex: Matemática, Inglês, Filosofia..."
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label htmlFor="objective-priority" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Prioridade
              </label>
              <select
                id="objective-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all"
              >
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
              </select>
            </div>
          </div>

          {/* Subtarefas / Micro-etapas (Fatiamento pedagógico) */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Micro-etapas (Recomendado para iniciantes)
              </label>
              <span className="text-xs text-slate-400">Divida para não procrastinar</span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask(e);
                  }
                }}
                placeholder="Adicionar micro-passo (ex: ler páginas 10 a 20)"
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:bg-white"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Adicionar
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="mt-2.5 max-h-32 overflow-y-auto space-y-1.5 pr-1">
                {subtasks.map((task, idx) => (
                  <div key={task.id} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-700 truncate mr-2">
                      {idx + 1}. {task.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(task.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Remover etapa"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              {objectiveToEdit ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
