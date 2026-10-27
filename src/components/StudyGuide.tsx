import React from 'react';
import { Target, CheckCircle, Split, Clock, Flame, BookOpen } from 'lucide-react';

export const StudyGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Intro */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Guia de Organização para Estudantes Iniciantes</h2>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              O maior obstáculo de quem está começando não é a falta de capacidade, mas o excesso de matéria solta sem uma rota clara. O <strong>StudyFlow</strong> foi estruturado para transformar metas vagas em passos executáveis.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Pedagogical Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">A Regra do Objetivo SMART</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Em vez de colocar <em className="text-rose-600 font-medium">"Aprender Matemática"</em> (muito amplo), prefira <strong className="text-emerald-700">"Resolver 15 exercícios de regra de três até sexta-feira"</strong>. Objetivos específicos reduzem a ansiedade de não saber por onde começar.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Fatiar em Micro-Etapas</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Cadastre pelo menos 3 subtarefas simples para cada objetivo no StudyFlow. O cérebro adora marcar caixas concluídas (gera dopamina natural) e diminui a procrastinação inicial.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Respeite o Prazo Limite</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Definir uma data limite ativa a Lei de Parkinson: o trabalho tende a se expandir para preencher o tempo disponível. Com um prazo realista de 3 a 7 dias, você mantém o senso de ritmo.
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="font-semibold text-slate-900 text-sm">Consistência &gt; Intensidade</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            30 minutos todo dia geram muito mais fixação neural e menos esgotamento mental do que estudar 6 horas em um único domingo desesperado antes da prova.
          </p>
        </div>
      </div>

      {/* Suggested Template for Beginners */}
      <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-5">
        <h3 className="text-sm font-bold text-indigo-950 mb-2 flex items-center gap-2">
          <Flame className="w-4 h-4 text-indigo-600" />
          Sugestão de Estrutura para seus Objetivos no StudyFlow
        </h3>
        <div className="text-xs text-slate-700 space-y-2 leading-relaxed">
          <p>
            <strong>Título:</strong> Ação + Tema (Ex: <em>Resumir Capítulo 3 de História</em>)
          </p>
          <p>
            <strong>Descrição:</strong> Critério de pronto (Ex: <em>Criar mapa mental de 1 página e responder questões de fixação do livro didático</em>)
          </p>
          <p>
            <strong>Micro-etapas:</strong> 1) Leitura rápida; 2) Sublinhar pontos-chave; 3) Mapa mental; 4) Exercícios.
          </p>
        </div>
      </div>
    </div>
  );
};
