import React, { useState, useEffect, useMemo } from 'react';
import { StudyObjective, ObjectiveStatus, SortOption } from './types/objective';
import { 
  loadObjectives, 
  saveObjectives, 
  resetToSampleObjectives, 
  clearAllObjectives 
} from './utils/storage';
import { Header } from './components/Header';
import { StatsBanner } from './components/StatsBanner';
import { ObjectiveCard } from './components/ObjectiveCard';
import { KanbanBoard } from './components/KanbanBoard';
import { StudyGuide } from './components/StudyGuide';
import { ObjectiveModal } from './components/ObjectiveModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { FocusTimerModal } from './components/FocusTimerModal';
import { ProductSpecModal } from './components/ProductSpecModal';
import { 
  Search, 
  Plus, 
  Filter, 
  ArrowUpDown, 
  RotateCcw, 
  Trash, 
  BookMarked,
  Sparkles,
  Info
} from 'lucide-react';

export default function App() {
  const [objectives, setObjectives] = useState<StudyObjective[]>(() => loadObjectives());
  const [currentTab, setCurrentTab] = useState<'list' | 'kanban' | 'guide'>('list');
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ObjectiveStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('deadline_asc');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [objectiveToEdit, setObjectiveToEdit] = useState<StudyObjective | null>(null);
  
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    id: string;
    title: string;
  }>({ isOpen: false, id: '', title: '' });

  const [focusModalState, setFocusModalState] = useState<{
    isOpen: boolean;
    objective: StudyObjective | null;
  }>({ isOpen: false, objective: null });

  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // Sync with localStorage on any change
  useEffect(() => {
    saveObjectives(objectives);
  }, [objectives]);

  // Unique categories for filtering
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    objectives.forEach(obj => {
      if (obj.category && obj.category.trim()) {
        set.add(obj.category.trim());
      }
    });
    return Array.from(set);
  }, [objectives]);

  // Filtered and sorted objectives
  const filteredObjectives = useMemo(() => {
    return objectives
      .filter((obj) => {
        // Status filter
        if (statusFilter !== 'all' && obj.status !== statusFilter) {
          return false;
        }
        // Category filter
        if (categoryFilter !== 'all' && obj.category !== categoryFilter) {
          return false;
        }
        // Search filter (title or description)
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchesTitle = obj.title.toLowerCase().includes(term);
          const matchesDesc = obj.description?.toLowerCase().includes(term);
          const matchesCategory = obj.category?.toLowerCase().includes(term);
          if (!matchesTitle && !matchesDesc && !matchesCategory) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline_asc') {
          return (a.deadline || '9999').localeCompare(b.deadline || '9999');
        }
        if (sortBy === 'deadline_desc') {
          return (b.deadline || '').localeCompare(a.deadline || '');
        }
        if (sortBy === 'created_desc') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'title_asc') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [objectives, statusFilter, categoryFilter, searchTerm, sortBy]);

  // Handlers for CRUD
  const handleOpenCreate = () => {
    setObjectiveToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (obj: StudyObjective) => {
    setObjectiveToEdit(obj);
    setIsModalOpen(true);
  };

  const handleSaveObjective = (
    data: Omit<StudyObjective, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ) => {
    const now = new Date().toISOString();
    if (data.id) {
      // Update existing
      setObjectives((prev) =>
        prev.map((item) =>
          item.id === data.id
            ? {
                ...item,
                title: data.title,
                description: data.description,
                deadline: data.deadline,
                status: data.status,
                category: data.category,
                priority: data.priority,
                subtasks: data.subtasks,
                updatedAt: now
              }
            : item
        )
      );
      showToast('Objetivo atualizado com sucesso!');
    } else {
      // Create new
      const newObjective: StudyObjective = {
        id: `obj-${Date.now()}`,
        title: data.title,
        description: data.description,
        deadline: data.deadline,
        status: data.status,
        category: data.category,
        priority: data.priority,
        subtasks: data.subtasks || [],
        createdAt: now,
        updatedAt: now
      };
      setObjectives((prev) => [newObjective, ...prev]);
      showToast('Novo objetivo cadastrado!');
    }
  };

  const handlePromptDelete = (id: string, title: string) => {
    setDeleteModalState({ isOpen: true, id, title });
  };

  const handleConfirmDelete = () => {
    if (!deleteModalState.id) return;
    setObjectives((prev) => prev.filter((o) => o.id !== deleteModalState.id));
    setDeleteModalState({ isOpen: false, id: '', title: '' });
    showToast('Objetivo excluído.');
  };

  const handleStatusChange = (id: string, newStatus: ObjectiveStatus) => {
    const now = new Date().toISOString();
    setObjectives((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: newStatus, updatedAt: now } : item
      )
    );
    showToast(`Status atualizado para "${newStatus.replace('_', ' ')}"!`);
  };

  const handleToggleSubtask = (objectiveId: string, subtaskId: string) => {
    setObjectives((prev) =>
      prev.map((obj) => {
        if (obj.id !== objectiveId) return obj;
        const updatedSubtasks = (obj.subtasks || []).map((sub) =>
          sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
        );
        return {
          ...obj,
          subtasks: updatedSubtasks,
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  const handleResetToSamples = () => {
    if (window.confirm('Deseja recarregar os exemplos didáticos sugeridos? Seus dados atuais serão substituídos pelos modelos iniciais.')) {
      const samples = resetToSampleObjectives();
      setObjectives(samples);
      showToast('Exemplos de estudo restaurados!');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Tem certeza de que deseja limpar todos os objetivos cadastrados?')) {
      const empty = clearAllObjectives();
      setObjectives(empty);
      showToast('Todos os objetivos foram removidos.');
    }
  };

  const handleStartFocus = (obj: StudyObjective) => {
    setFocusModalState({ isOpen: true, objective: obj });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Bar Navigation */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenCreate={handleOpenCreate}
        onOpenSpec={() => setIsSpecModalOpen(true)}
        totalCount={objectives.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress & Overview Banner */}
        <StatsBanner objectives={objectives} />

        {/* Tab 1: List / Cards View */}
        {currentTab === 'list' && (
          <div>
            {/* Filter and Search Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 mb-6 shadow-2xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar objetivo por título, matéria ou descrição..."
                    className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:bg-white transition-colors"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                {/* Filters & Sorting */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {/* Category Filter */}
                  {availableCategories.length > 0 && (
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-600 cursor-pointer"
                    >
                      <option value="all">Todas as Matérias</option>
                      {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Sort by */}
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="bg-transparent text-slate-700 text-xs focus:outline-none cursor-pointer"
                    >
                      <option value="deadline_asc">Prazo: Mais próximo primeiro</option>
                      <option value="deadline_desc">Prazo: Mais distante</option>
                      <option value="created_desc">Mais recente cadastrado</option>
                      <option value="title_asc">Ordem alfabética (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Status Segmented Control (Filter Buttons) */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs overflow-x-auto max-w-full">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      statusFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Todos ({objectives.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('nao_iniciado')}
                    className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      statusFilter === 'nao_iniciado'
                        ? 'bg-white text-slate-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Não iniciado ({objectives.filter((o) => o.status === 'nao_iniciado').length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('em_andamento')}
                    className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      statusFilter === 'em_andamento'
                        ? 'bg-white text-blue-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Em andamento ({objectives.filter((o) => o.status === 'em_andamento').length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('pausado')}
                    className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      statusFilter === 'pausado'
                        ? 'bg-white text-amber-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Pausado ({objectives.filter((o) => o.status === 'pausado').length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('concluido')}
                    className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      statusFilter === 'concluido'
                        ? 'bg-white text-emerald-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Concluído ({objectives.filter((o) => o.status === 'concluido').length})
                  </button>
                </div>

                {/* Helper reset buttons */}
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <button
                    onClick={handleResetToSamples}
                    className="hover:text-indigo-600 transition-colors cursor-pointer flex items-center gap-1"
                    title="Restaurar objetivos de exemplo para testar"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Recarregar Exemplos</span>
                  </button>
                  <span aria-hidden="true">·</span>
                  <button
                    onClick={handleClearAll}
                    className="hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1"
                    title="Limpar todos os objetivos"
                  >
                    <Trash className="w-3.5 h-3.5" />
                    <span>Limpar Lista</span>
                  </button>
                </div>
              </div>
            </div>

            {/* List Grid */}
            {filteredObjectives.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BookMarked className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                    ? 'Nenhum objetivo encontrado com esses filtros'
                    : 'Nenhum objetivo cadastrado ainda'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                  {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all'
                    ? 'Tente ajustar os filtros ou pesquisar por outro termo para encontrar o que procura.'
                    : 'Comece cadastrando seu primeiro objetivo de estudo para dar o primeiro passo com foco e clareza.'}
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' ? (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setStatusFilter('all');
                        setCategoryFilter('all');
                      }}
                      className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Limpar Filtros
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleResetToSamples}
                        className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Carregar Exemplos
                      </button>
                      <button
                        onClick={handleOpenCreate}
                        className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
                      >
                        <Plus className="w-4 h-4" />
                        Cadastrar Primeiro Objetivo
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredObjectives.map((obj) => (
                  <ObjectiveCard
                    key={obj.id}
                    objective={obj}
                    onEdit={handleOpenEdit}
                    onDelete={handlePromptDelete}
                    onStatusChange={handleStatusChange}
                    onToggleSubtask={handleToggleSubtask}
                    onStartFocus={handleStartFocus}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Visual Kanban View */}
        {currentTab === 'kanban' && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Fluxo Visual de Estudos</h2>
                <p className="text-xs text-slate-500">
                  Acompanhe a transição dos seus objetivos da concepção até a conclusão.
                </p>
              </div>
              <button
                onClick={handleOpenCreate}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Novo Objetivo
              </button>
            </div>

            <KanbanBoard
              objectives={objectives}
              onEdit={handleOpenEdit}
              onDelete={handlePromptDelete}
              onStatusChange={handleStatusChange}
              onOpenCreate={handleOpenCreate}
            />
          </div>
        )}

        {/* Tab 3: Study Guide View */}
        {currentTab === 'guide' && <StudyGuide />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">StudyFlow</span>
            <span aria-hidden="true">·</span>
            <span>Plataforma de Organização de Objetivos Educacionais</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setIsSpecModalOpen(true)}
              className="text-indigo-600 hover:underline cursor-pointer"
            >
              Documentação V1 & Critérios de Teste
            </button>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-slate-400">
              Dados salvos localmente
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ObjectiveModal
        isOpen={isModalOpen}
        objectiveToEdit={objectiveToEdit}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveObjective}
      />

      <DeleteConfirmModal
        isOpen={deleteModalState.isOpen}
        objectiveTitle={deleteModalState.title}
        onClose={() => setDeleteModalState({ isOpen: false, id: '', title: '' })}
        onConfirm={handleConfirmDelete}
      />

      <FocusTimerModal
        isOpen={focusModalState.isOpen}
        objective={focusModalState.objective}
        onClose={() => setFocusModalState({ isOpen: false, objective: null })}
        onMarkCompleted={(id) => handleStatusChange(id, 'concluido')}
      />

      <ProductSpecModal
        isOpen={isSpecModalOpen}
        onClose={() => setIsSpecModalOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-medium shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
