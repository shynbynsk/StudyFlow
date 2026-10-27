import React from 'react';
import { Plus, BookOpen, Layers, Lightbulb, FileCheck } from 'lucide-react';

interface HeaderProps {
  currentTab: 'list' | 'kanban' | 'guide';
  onTabChange: (tab: 'list' | 'kanban' | 'guide') => void;
  onOpenCreate: () => void;
  onOpenSpec: () => void;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  onOpenCreate,
  onOpenSpec,
  totalCount
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single Brand wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => onTabChange('list')}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  S
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap">
                  StudyFlow
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onTabChange('list')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                currentTab === 'list' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Meus Objetivos</span>
              <span className="font-mono tabular-nums text-xs text-slate-400">({totalCount})</span>
            </button>

            <button
              onClick={() => onTabChange('kanban')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                currentTab === 'kanban' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Visão em Fluxo</span>
            </button>

            <button
              onClick={() => onTabChange('guide')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 ${
                currentTab === 'guide' ? 'text-indigo-600 font-semibold border-b-2 border-indigo-600' : ''
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              <span>Dicas de Estudo</span>
            </button>

            <button
              onClick={onOpenSpec}
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 py-1 text-slate-500 hover:text-indigo-600"
              title="Especificações do Produto e Critérios de Teste da V1"
            >
              <FileCheck className="w-4 h-4 text-indigo-500" />
              <span>Sobre o Produto (V1)</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Objetivo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation tab strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 px-2 py-1.5 bg-slate-50 text-xs">
        <button
          onClick={() => onTabChange('list')}
          className={`px-3 py-1.5 rounded-md font-medium ${
            currentTab === 'list' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
          }`}
        >
          Objetivos ({totalCount})
        </button>
        <button
          onClick={() => onTabChange('kanban')}
          className={`px-3 py-1.5 rounded-md font-medium ${
            currentTab === 'kanban' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
          }`}
        >
          Fluxo
        </button>
        <button
          onClick={() => onTabChange('guide')}
          className={`px-3 py-1.5 rounded-md font-medium ${
            currentTab === 'guide' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
          }`}
        >
          Dicas
        </button>
        <button
          onClick={onOpenSpec}
          className="px-3 py-1.5 rounded-md font-medium text-indigo-600"
        >
          Sobre V1
        </button>
      </div>
    </header>
  );
};
