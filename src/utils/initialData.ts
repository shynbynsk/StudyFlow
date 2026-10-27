import { StudyObjective } from '../types/objective';

export const INITIAL_OBJECTIVES: StudyObjective[] = [
  {
    id: 'obj-1',
    title: 'Dominar Lógica de Programação Básica',
    description: 'Entender variáveis, estruturas condicionais (if/else) e laços de repetição (for/while) resolvendo 10 exercícios práticos.',
    deadline: '2026-11-15',
    status: 'em_andamento',
    category: 'Tecnologia',
    priority: 'alta',
    subtasks: [
      { id: 'sub-1', title: 'Assistir aula introdutória sobre variáveis', completed: true },
      { id: 'sub-2', title: 'Resolver 5 exercícios de if/else', completed: true },
      { id: 'sub-3', title: 'Fazer lista de exercícios sobre laços', completed: false },
      { id: 'sub-4', title: 'Construir miniprojeto: calculadora no terminal', completed: false }
    ],
    createdAt: '2026-10-20T10:00:00.000Z',
    updatedAt: '2026-10-25T14:30:00.000Z'
  },
  {
    id: 'obj-2',
    title: 'Vocabulário Essencial de Inglês para Estudos',
    description: 'Aprender e fixar 50 palavras mais frequentes em textos acadêmicos e tutoriais técnicos usando repetição espaçada.',
    deadline: '2026-11-05',
    status: 'em_andamento',
    category: 'Idiomas',
    priority: 'media',
    subtasks: [
      { id: 'sub-5', title: 'Criar baralho no Anki com 50 palavras', completed: true },
      { id: 'sub-6', title: 'Revisar 15 minutos diariamente', completed: false },
      { id: 'sub-7', title: 'Ler 1 artigo simples em inglês sem tradutor', completed: false }
    ],
    createdAt: '2026-10-22T08:00:00.000Z',
    updatedAt: '2026-10-26T09:15:00.000Z'
  },
  {
    id: 'obj-3',
    title: 'Fundamentos de Redação Dissertativa',
    description: 'Aprender a estrutura de introdução (tese), desenvolvimento (argumentos) e conclusão (proposta de intervenção).',
    deadline: '2026-11-20',
    status: 'nao_iniciado',
    category: 'Português',
    priority: 'alta',
    subtasks: [
      { id: 'sub-8', title: 'Mapear conectivos de coesão textual', completed: false },
      { id: 'sub-9', title: 'Escrever 1 redação diagnóstica', completed: false },
      { id: 'sub-10', title: 'Revisar erros de concordância e pontuação', completed: false }
    ],
    createdAt: '2026-10-24T12:00:00.000Z',
    updatedAt: '2026-10-24T12:00:00.000Z'
  },
  {
    id: 'obj-4',
    title: 'Organizar Espaço Físico e Cronograma Semanal',
    description: 'Definir horário fixo de 1 hora por dia para estudar sem distrações e organizar mesa de estudo com materiais essenciais.',
    deadline: '2026-10-30',
    status: 'concluido',
    category: 'Produtividade',
    priority: 'baixa',
    subtasks: [
      { id: 'sub-11', title: 'Limpar e organizar a escrivaninha', completed: true },
      { id: 'sub-12', title: 'Definir bloco de 19h às 20h na agenda', completed: true },
      { id: 'sub-13', title: 'Configurar modo não perturbe no celular', completed: true }
    ],
    createdAt: '2026-10-18T16:00:00.000Z',
    updatedAt: '2026-10-21T18:00:00.000Z'
  }
];

export const STATUS_LABELS: Record<string, string> = {
  nao_iniciado: 'Não iniciado',
  em_andamento: 'Em andamento',
  concluido: 'Concluído',
  pausado: 'Pausado'
};
