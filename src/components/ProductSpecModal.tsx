import React from 'react';
import { X, CheckCircle, Target, Users, ListChecks } from 'lucide-react';

interface ProductSpecModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductSpecModal: React.FC<ProductSpecModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="spec-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div>
            <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
              Documento de Visão de Produto · V1
            </span>
            <h2 id="spec-modal-title" className="text-lg font-bold text-slate-900">
              StudyFlow — Especificação Educacional
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="overflow-y-auto py-5 pr-2 space-y-6 text-sm text-slate-700 flex-1">
          {/* 1. Problema */}
          <section className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <div className="flex items-center gap-2 text-indigo-900 font-bold mb-2">
              <Target className="w-4 h-4 text-indigo-600" />
              <h3>1. Problema que o aplicativo resolve</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Estudantes iniciantes frequentemente sofrem de <strong>paralisia por sobrecarga de conteúdo</strong> e falta de direção clara. Sem uma ferramenta simples e objetiva, eles:
            </p>
            <ul className="list-disc list-inside text-xs text-slate-600 mt-2 space-y-1">
              <li>Definem metas genéricas demais ("preciso estudar física"), sem prazo nem critérios de conclusão claros;</li>
              <li>Perdem o ritmo por não enxergarem o próprio progresso diário;</li>
              <li>Sentem-se frustrados com ferramentas corporativas complexas (como Jira, Notion ou Trello avançado), que exigem curva de aprendizado excessiva antes mesmo de começar a estudar;</li>
              <li>Perdem registros ao fechar abas do navegador ou tentar anotar em papéis avulsos.</li>
            </ul>
          </section>

          {/* 2. Público */}
          <section className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <div className="flex items-center gap-2 text-indigo-900 font-bold mb-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <h3>2. Público Principal</h3>
            </div>
            <ul className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
              <li>
                <strong>Estudantes em transição de carreira ou novos autodidatas:</strong> Pessoas aprendendo novas habilidades (programação, idiomas, design) por conta própria e que precisam de autonomia guiada.
              </li>
              <li>
                <strong>Alunos do Ensino Médio / Pré-Vestibular / ENEM:</strong> Estudantes que precisam organizar múltiplos tópicos e disciplinas com prazos bem marcados.
              </li>
              <li>
                <strong>Universitários nos primeiros períodos:</strong> Que se deparam repentinamente com alta carga de matérias sem cobrança diária dos professores e precisam de autodisciplina.
              </li>
            </ul>
          </section>

          {/* 3. Requisitos Funcionais */}
          <section className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <div className="flex items-center gap-2 text-indigo-900 font-bold mb-2">
              <ListChecks className="w-4 h-4 text-indigo-600" />
              <h3>3. Requisitos Funcionais da Versão 1</h3>
            </div>
            <div className="text-xs text-slate-600 space-y-2">
              <p><strong>[RF01] Cadastro de Objetivo:</strong> O estudante cadastra um objetivo informando título (obrigatório), descrição detalhada, prazo (data limite) e status.</p>
              <p><strong>[RF02] Visualização dos Objetivos:</strong> Listagem ordenada de todos os objetivos, com exibição clara de título, descrição, prazo formatado, status e dias restantes até a entrega.</p>
              <p><strong>[RF03] Edição de Objetivo:</strong> Permite alterar qualquer campo do objetivo a qualquer momento (título, descrição, prazo, status).</p>
              <p><strong>[RF04] Exclusão de Objetivo:</strong> Permite remover objetivos com diálogo de confirmação prévia para evitar perdas acidentais.</p>
              <p><strong>[RF05] Persistência Local:</strong> Todos os dados de objetivos são mantidos em armazenamento local (localStorage), garantindo que a página possa ser atualizada ou reaberta sem perda dos dados cadastrados.</p>
            </div>
          </section>

          {/* 4. Critérios de Teste */}
          <section className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
            <div className="flex items-center gap-2 text-indigo-900 font-bold mb-2">
              <CheckCircle className="w-4 h-4 text-indigo-600" />
              <h3>4. Critérios para Testar a Primeira Versão</h3>
            </div>
            <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
              <div>
                <strong className="text-slate-800">Cenário 1 — Cadastro com sucesso e validação de campos:</strong>
                <p>Inserir título, descrição, prazo e status e submeter. O novo card deve surgir imediatamente na listagem com os dados corretos. Tentar enviar sem título ou sem prazo deve alertar o usuário sem travar.</p>
              </div>
              <div>
                <strong className="text-slate-800">Cenário 2 — Visualização e legibilidade:</strong>
                <p>Verificar se todos os objetivos criados aparecem organizados, com o prazo em formato legível (DD/MM/AAAA) e indicação do status atual.</p>
              </div>
              <div>
                <strong className="text-slate-800">Cenário 3 — Edição de dados:</strong>
                <p>Clicar em editar em um objetivo existente, alterar o título, estender o prazo ou trocar o status (ex: de "Não iniciado" para "Em andamento"). O card deve refletir a mudança instantaneamente.</p>
              </div>
              <div>
                <strong className="text-slate-800">Cenário 4 — Exclusão com confirmação:</strong>
                <p>Clicar no botão de lixeira de um objetivo. O sistema deve abrir modal de confirmação. Ao confirmar, o objetivo deve desaparecer da lista.</p>
              </div>
              <div>
                <strong className="text-slate-800">Cenário 5 — Persistência após reload:</strong>
                <p>Cadastrar ou editar um objetivo, atualizar a página do navegador (F5 / reload). Todos os dados e estados alterados devem permanecer intactos.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
